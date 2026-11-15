import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { auth } from '@/services/firebase';

// Firebase connecte automatiquement un compte qu'on vient de créer.
// Pendant l'inscription, useAuth ignore ces changements,
// pour que le joueur passe ensuite par l'écran de connexion.
let isSigningUp = false;

export function isSignUpInProgress(): boolean {
  return isSigningUp;
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signUp(pseudo: string, email: string, password: string): Promise<void> {
  isSigningUp = true;
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
    // Le pseudo est enregistré dans le profil Firebase du joueur
    await updateProfile(user, { displayName: pseudo.trim() });
  } finally {
    // Dans tous les cas (succès ou erreur), on ne laisse personne connecté
    await firebaseSignOut(auth);
    isSigningUp = false;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Firebase renvoie des codes techniques ("auth/weak-password") :
// on les traduit en messages compréhensibles pour le joueur.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Adresse e-mail invalide.',
  'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
  'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail.',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
  'auth/network-request-failed': 'Pas de connexion Internet.',
  'auth/too-many-requests': 'Trop de tentatives, réessaie dans quelques minutes.',
};

const DEFAULT_ERROR_MESSAGE = 'Une erreur est survenue, réessaie.';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? DEFAULT_ERROR_MESSAGE;
  }
  return DEFAULT_ERROR_MESSAGE;
}