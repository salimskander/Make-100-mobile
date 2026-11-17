import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
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

      <TextField
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        editable={!isSubmitting}
      />
      <TextField
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        editable={!isSubmitting}
      />

      {error !== null && <Text style={formStyles.error}>{error}</Text>}

      <Button title="Se connecter" onPress={handleSubmit} loading={isSubmitting} disabled={!canSubmit} />
      <Button title="Créer un compte" variant="secondary" onPress={() => router.replace('/register')} />
    </KeyboardAvoidingView>
  );
}