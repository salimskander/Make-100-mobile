import { useEffect, useState } from 'react';

export function useTimer() {
  const [startedAt, setStartedAt] = useState(Date.now);
  const [now, setNow] = useState(Date.now);

  // Rafraîchit l'affichage une fois par seconde, et s'arrête quand l'écran disparaît
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  function reset() {
    const time = Date.now();
    setStartedAt(time);
    setNow(time);
  }

  // Temps exact en millisecondes, lu au moment où on l'appelle
  function elapsedMs() {
    return Date.now() - startedAt;
  }

  return { seconds: Math.floor((now - startedAt) / 1000), reset, elapsedMs };
}
