import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-expect-error : la fonction existe dans la version React Native de Firebase, mais ses types ne l'exportent pas
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Identifiants publics du projet Firebase (console > Paramètres du projet > Vos applications)
const firebaseConfig = {
  apiKey: 'AIzaSyBtvBYBfVc2R4efM833DMc8lLRhAgMf5CI',
  authDomain: 'make-100-60bfd.firebaseapp.com',
  projectId: 'make-100-60bfd',
  storageBucket: 'make-100-60bfd.firebasestorage.app',
  messagingSenderId: '801492008441',
  appId: '1:801492008441:web:94ef1fca327e5ad5411128',
};

// Avec le rechargement à chaud, ce fichier peut être exécuté plusieurs fois :
// on n'initialise Firebase qu'une seule fois, puis on réutilise l'instance existante.
const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// Connexion : la session est enregistrée dans AsyncStorage,
// donc l'utilisateur reste connecté quand il rouvre l'application.
export const auth = isFirstInit
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);

// Base de données Firestore, utilisée pour le classement (étape suivante)
export const db = getFirestore(app);