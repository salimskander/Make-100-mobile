import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { formStyles } from '@/constants/form-styles';
import { getAuthErrorMessage, signUp } from '@/services/auth';

const PSEUDO_MIN_LENGTH = 3;
const PSEUDO_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 6;

type SignUpForm = {
  pseudo: string;
  email: string;
  password: string;
  confirmation: string;
};

// Vérifie le formulaire avant d'appeler Firebase.
// Renvoie le premier message d'erreur trouvé, ou null si tout est valide.
function validateSignUp(form: SignUpForm): string | null {
  const pseudo = form.pseudo.trim();
  if (pseudo.length < PSEUDO_MIN_LENGTH || pseudo.length > PSEUDO_MAX_LENGTH) {
    return `Le pseudo doit contenir entre ${PSEUDO_MIN_LENGTH} et ${PSEUDO_MAX_LENGTH} caractères.`;
  }
  if (form.email.trim() === '') {
    return "L'adresse e-mail est obligatoire.";
  }
  if (form.password.length < PASSWORD_MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;
  }
  if (form.password !== form.confirmation) {
    return 'Les mots de passe ne correspondent pas.';
  }
  return null;
}

export default function RegisterScreen() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const validationError = validateSignUp({ pseudo, email, password, confirmation });
    if (validationError !== null) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signUp(pseudo, email, password);
      // Compte créé : on renvoie vers la connexion, avec l'e-mail prérempli
      router.replace({ pathname: '/login', params: { registered: '1', email: email.trim() } });
    } catch (e) {
      setError(getAuthErrorMessage(e));
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={formStyles.container} keyboardShouldPersistTaps="handled">
        <Text style={formStyles.title}>Créer un compte</Text>

        <TextField
          placeholder={`Pseudo (${PSEUDO_MIN_LENGTH} à ${PSEUDO_MAX_LENGTH} caractères)`}
          value={pseudo}
          onChangeText={setPseudo}
          autoCapitalize="none"
          maxLength={PSEUDO_MAX_LENGTH}
          editable={!isSubmitting}
        />
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
          placeholder={`Mot de passe (${PASSWORD_MIN_LENGTH} caractères minimum)`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          editable={!isSubmitting}
        />
        <TextField
          placeholder="Confirmer le mot de passe"
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry
          autoComplete="new-password"
          editable={!isSubmitting}
        />

        {error !== null && <Text style={formStyles.error}>{error}</Text>}

        <Button title="Créer le compte" onPress={handleSubmit} loading={isSubmitting} />
        <Button title="J'ai déjà un compte" variant="secondary" onPress={() => router.replace('/login')} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});