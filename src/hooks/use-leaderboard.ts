import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchLeaderboard, type Score } from '@/services/scores';

type Status = 'loading' | 'error' | 'success';

export function useLeaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  const fetchScores = useCallback(async () => {
    try {
      setScores(await fetchLeaderboard());
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  // Chargement à chaque fois que l'onglet devient visible :
  // les onglets restent montés, un simple useEffect ne se relancerait pas.
  useFocusEffect(
    useCallback(() => {
      void fetchScores();
    }, [fetchScores]),
  );

  // Rechargement demandé par le joueur (bouton « Réessayer » ou glisser vers le bas)
  const reload = useCallback(() => {
    setStatus('loading');
    void fetchScores();
  }, [fetchScores]);

  return { scores, status, reload };
}