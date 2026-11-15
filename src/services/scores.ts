import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '@/services/firebase';

export type Score = {
  id: string;
  pseudo: string;
  timeMs: number;
  digits: string;
};

const LEADERBOARD_SIZE = 10;
const scoresCollection = collection(db, 'scores');

// Enregistre le score du joueur connecté (appelé par l'écran de jeu en cas de victoire)
export async function submitScore(timeMs: number, digits: string): Promise<void> {
  const user = auth.currentUser;
  if (user === null) {
    throw new Error('Aucun joueur connecté.');
  }
  await addDoc(scoresCollection, {
    uid: user.uid,
    pseudo: user.displayName ?? 'Anonyme',
    timeMs,
    digits,
    createdAt: serverTimestamp(),
  });
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