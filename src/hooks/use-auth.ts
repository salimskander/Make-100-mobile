import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '@/services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase prévient à chaque changement : connexion, déconnexion,
    // et au démarrage, une fois qu'il a relu la session enregistrée.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe; // on arrête l'écoute quand le composant disparaît
  }, []);

  return { user, isLoading };
}