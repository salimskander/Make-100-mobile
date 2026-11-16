import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

import { flushPendingScores } from '@/services/scores';

// Envoie les scores en attente au démarrage et à chaque retour du réseau
export function useScoreSync() {
  useEffect(() => {
    // NetInfo appelle l'écouteur avec l'état actuel, puis à chaque changement de réseau
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === true && state.isInternetReachable !== false) {
        void flushPendingScores();
      }
    });
    return unsubscribe;
  }, []);
}