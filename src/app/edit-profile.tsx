import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { formStyles } from '@/constants/form-styles';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { changeEmail, getAuthErrorMessage, sendPasswordReset, updatePseudo } from '@/services/auth';
import { renamePlayerScores } from '@/services/scores';

type Message = { type: 'success' | 'error'; text: string } | null;

// Même règle qu'à l'inscription
function validatePseudo(pseudo: string): string | null {
  const length = pseudo.trim().length;
  if (length < 3 || length > 20) return 'Le pseudo doit contenir entre 3 et 20 caractères.';
  return null;
}

function MessageText({ message }: { message: Message }) {
  if (message === null) return null;
  return <Text style={message.type === 'success' ? formStyles.success : formStyles.error}>{message.text}</Text>;
}

export default function EditProfileScreen() {
  const { user } = useAuth();

  // Bloc 1 : pseudo
  const [pseudo, setPseudo] = useState(user?.displayName ?? '');
  const [isSavingPseudo, setIsSavingPseudo] = useState(false);
  const [pseudoMessage, setPseudoMessage] = useState<Message>(null);

  // Bloc 2 : e-mail
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<Message>(null);

  // Bloc 3 : mot de passe
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState<Message>(null);

  async function handleSavePseudo() {
    const validationError = validatePseudo(pseudo);
    if (validationError !== null) {
      setPseudoMessage({ type: 'error', text: validationError });
      return;
    }
    setPseudoMessage(null);
    setIsSavingPseudo(true);

    // 1. Le profil Firebase
    try {
      await updatePseudo(pseudo);
    } catch (e) {
      setPseudoMessage({ type: 'error', text: getAuthErrorMessage(e) });
      setIsSavingPseudo(false);
      return;
    }

    // 2. Les scores du joueur dans le classement
    try {
      await renamePlayerScores(pseudo.trim());
      setPseudoMessage({ type: 'success', text: 'Pseudo modifié, classement mis à jour.' });
    } catch {
      setPseudoMessage({ type: 'error', text: "Pseudo modifié, mais le classement n'a pas pu être mis à jour." });
    } finally {
      setIsSavingPseudo(false);
    }
  }

  async function handleChangeEmail() {
    if (newEmail.trim() === user?.email) {
      setEmailMessage({ type: 'error', text: "C'est déjà ton adresse e-mail." });
      return;
    }
    setEmailMessage(null);
    setIsSavingEmail(true);
    try {
      await changeEmail(newEmail, currentPassword);
      setEmailMessage({
        type: 'success',
        text: `Un lien de confirmation a été envoyé à ${newEmail.trim()}. Ton adresse changera après le clic.`,
      });
      setCurrentPassword('');
    } catch (e) {
      setEmailMessage({ type: 'error', text: getAuthErrorMessage(e) });
    } finally {
      setIsSavingEmail(false);
    }
  }

  async function handleSendReset() {
    if (!user?.email) return;
    setResetMessage(null);
    setIsSendingReset(true);
    try {
      await sendPasswordReset(user.email);
      setResetMessage({ type: 'success', text: `Un e-mail a été envoyé à ${user.email}.` });
    } catch (e) {
      setResetMessage({ type: 'error', text: getAuthErrorMessage(e) });
    } finally {
      setIsSendingReset(false);
    }
  }

  const canSavePseudo = pseudo.trim() !== (user?.displayName ?? '') && !isSavingPseudo;
  const canChangeEmail = newEmail.trim() !== '' && currentPassword !== '' && !isSavingEmail;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Pseudo</Text>
          <TextField value={pseudo} onChangeText={setPseudo} autoCapitalize="none" editable={!isSavingPseudo} />
          <MessageText message={pseudoMessage} />
          <Button title="Enregistrer le pseudo" onPress={handleSavePseudo} loading={isSavingPseudo} disabled={!canSavePseudo} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Adresse e-mail</Text>
          <Text style={styles.hint}>Actuelle : {user?.email ?? '—'}</Text>
          <TextField
            placeholder="Nouvelle adresse e-mail"
            value={newEmail}
            onChangeText={setNewEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            editable={!isSavingEmail}
          />
          <TextField
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoComplete="current-password"
            editable={!isSavingEmail}
          />
          <MessageText message={emailMessage} />
          <Button title="Changer l’adresse e-mail" onPress={handleChangeEmail} loading={isSavingEmail} disabled={!canChangeEmail} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Mot de passe</Text>
          <Text style={styles.hint}>Tu recevras un lien pour choisir un nouveau mot de passe.</Text>
          <MessageText message={resetMessage} />
          <Button title="Recevoir le lien" variant="secondary" onPress={handleSendReset} loading={isSendingReset} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.lg },
  card: { gap: spacing.md },
  sectionTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  hint: { ...typography.caption, color: colors.textMuted },
});