import NetInfo from '@react-native-community/netinfo';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';

import { auth, db } from '@/services/firebase';
import {
  addPendingScore,
  getPendingScores,
  savePendingScores,
  type PendingScore,
} from '@/services/score-queue';

export type Score = {
  id: string;
  pseudo: string;
  timeMs: number;
  digits: string;
};

// 'sent' : envoyé à Firestore ; 'queued' : gardé sur le téléphone, envoyé plus tard
export type SubmitResult = 'sent' | 'queued';

const LEADERBOARD_SIZE = 10;
const scoresCollection = collection(db, 'scores');

async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
}

async function sendScore(score: PendingScore): Promise<void> {
  await addDoc(scoresCollection, { ...score, createdAt: serverTimestamp() });
}

// Enregistre le score du joueur connecté (appelé par l'écran de jeu en cas de victoire)
export async function submitScore(timeMs: number, digits: string): Promise<SubmitResult> {
  const user = auth.currentUser;
  if (user === null) {
    throw new Error('Aucun joueur connecté.');
  }
  const score: PendingScore = {
    uid: user.uid,
    pseudo: user.displayName ?? 'Anonyme',
    timeMs,
    digits,
    playedAt: Date.now(),
  };

  if (!(await isOnline())) {
    await addPendingScore(score);
    return 'queued';
  }
  try {
    await sendScore(score);
    return 'sent';
  } catch {
    await addPendingScore(score); // l'envoi a échoué : on le garde pour plus tard
    return 'queued';
  }
}

let isFlushing = false;

// Envoie les scores en attente du joueur connecté. Renvoie le nombre de scores envoyés.
export async function flushPendingScores(): Promise<number> {
  const user = auth.currentUser;
  if (isFlushing || user === null) return 0;

  isFlushing = true;
  try {
    const pending = await getPendingScores();
    const remaining: PendingScore[] = [];
    let sentCount = 0;

    for (const score of pending) {
      // Les règles Firestore n'autorisent que l'envoi de ses propres scores
      if (score.uid !== user.uid) {
        remaining.push(score);
        continue;
      }
      try {
        await sendScore(score);
        sentCount++;
      } catch {
        remaining.push(score); // nouvel échec : il reste dans la file
      }
    }

    await savePendingScores(remaining);
    return sentCount;
  } finally {
    isFlushing = false;
  }
}

// Récupère les meilleurs temps, du plus rapide au plus lent
export async function fetchLeaderboard(): Promise<Score[]> {
  const leaderboardQuery = query(scoresCollection, orderBy('timeMs', 'asc'), limit(LEADERBOARD_SIZE));
  const snapshot = await getDocs(leaderboardQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      pseudo: String(data.pseudo),
      timeMs: Number(data.timeMs),
      digits: String(data.digits),
    };
  });
}

// Après un changement de pseudo : renomme les scores du joueur,
// en ligne (Firestore) et dans la file d'attente hors ligne.
export async function renamePlayerScores(pseudo: string): Promise<void> {
  const user = auth.currentUser;
  if (user === null) throw new Error('Aucun joueur connecté.');

  // 1. Scores déjà envoyés : une seule écriture groupée
  const snapshot = await getDocs(query(scoresCollection, where('uid', '==', user.uid)));
  const batch = writeBatch(db);
  snapshot.forEach((scoreDoc) => batch.update(scoreDoc.ref, { pseudo }));
  await batch.commit();

  // 2. Scores encore en attente sur le téléphone
  const pending = await getPendingScores();
  await savePendingScores(pending.map((s) => (s.uid === user.uid ? { ...s, pseudo } : s)));
}