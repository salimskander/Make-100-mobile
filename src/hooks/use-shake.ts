import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';

const SHAKE_THRESHOLD_G = 1.8;   // force au-delà de laquelle on considère une secousse
const COOLDOWN_MS = 1000;        // délai minimum entre deux secousses détectées
const UPDATE_INTERVAL_MS = 100;  // une mesure toutes les 100 ms (10 par seconde)

export function useShake(onShake: () => void) {
  // On garde toujours la dernière version du callback, sans relancer le capteur
  const onShakeRef = useRef(onShake);
  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    let lastShakeAt = 0;
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (force > SHAKE_THRESHOLD_G && now - lastShakeAt > COOLDOWN_MS) {
        lastShakeAt = now;
        onShakeRef.current();
      }
    });

    return () => subscription.remove(); // on coupe le capteur quand l'écran disparaît
  }, []);
}