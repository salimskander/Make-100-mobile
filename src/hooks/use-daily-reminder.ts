import { useEffect, useState } from 'react';

import {
  cancelDailyChallenge,
  isDailyChallengeScheduled,
  scheduleDailyChallenge,
} from '@/services/notifications';

export function useDailyReminder() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Au chargement : le rappel est-il déjà programmé ?
  useEffect(() => {
    isDailyChallengeScheduled()
      .then(setIsEnabled)
      .catch(() => setIsEnabled(false))
      .finally(() => setIsLoading(false));
  }, []);

  async function setEnabled(value: boolean) {
    setError(null);
    setIsLoading(true);
    try {
      if (value) {
        const scheduled = await scheduleDailyChallenge();
        if (!scheduled) {
          setError('Autorise les notifications dans les réglages du téléphone pour activer le rappel.');
        }
        setIsEnabled(scheduled);
      } else {
        await cancelDailyChallenge();
        setIsEnabled(false);
      }
    } catch {
      setError('Impossible de modifier le rappel.');
    } finally {
      setIsLoading(false);
    }
  }

  return { isEnabled, isLoading, error, setEnabled };
}