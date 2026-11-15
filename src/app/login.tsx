import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
} from 'react-native';

import { formStyles } from '@/constants/form-styles';
import { getAuthErrorMessage, signIn } from '@/services/auth';

export default function LoginScreen() {
  // Paramètres transmis par l'écran d'inscription après la création du compte
  const params = useLocalSearchParams<{ registered?: string; email?: string }>();
  const justRegistered = params.registered === '1';

  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = email.trim() !== '' && password !== '' && !isSubmitting;

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      // Pas de navigation ici : useAuth détecte la connexion et le layout affiche le jeu.
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={formStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={formStyles.title}>Connexion</Text>

      {justRegistered && error === null && (
        <Text style={formStyles.success}>Compte créé ! Connecte-toi pour jouer.</Text>
      )}

      <TextInput
        style={formStyles.input}
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        editable={!isSubmitting}
      />
      <TextInput
        style={formStyles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        editable={!isSubmitting}
      />

      {error !== null && <Text style={formStyles.error}>{error}</Text>}

      <Pressable
        style={[formStyles.button, !canSubmit && formStyles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={formStyles.buttonText}>Se connecter</Text>
        )}
      </Pressable>

      <Link href="/register" replace style={formStyles.link}>
        Pas encore de compte ? Créer un compte
      </Link>
    </KeyboardAvoidingView>
  );
}