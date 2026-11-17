import AsyncStorage from '@react-native-async-storage/async-storage';

// Un score pas encore envoyé : il contient tout ce qu'il faut pour l'envoyer plus tard
export type PendingScore = {
  uid: string;
  pseudo: string;
  timeMs: number;
  digits: string;
  playedAt: number; // date de la partie (millisecondes)
};

const STORAGE_KEY = 'make100/pending-scores';

export async function getPendingScores(): Promise<PendingScore[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  try {
    return JSON.parse(raw) as PendingScore[];
  } catch {
    return []; // contenu illisible : on repart d'une file vide
  }
}

export async function savePendingScores(scores: PendingScore[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export async function addPendingScore(score: PendingScore): Promise<void> {
  const scores = await getPendingScores();
  await savePendingScores([...scores, score]);
}