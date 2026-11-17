import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useDailyReminder } from '@/hooks/use-daily-reminder';
import { signOut } from '@/services/auth';
import { getPendingScores } from '@/services/score-queue';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets(); // hauteur de l'encoche et de la barre d'état
  const { user } = useAuth();
  const reminder = useDailyReminder();
  const [pendingCount, setPendingCount] = useState(0);

  // À chaque affichage de l'onglet : combien de scores du joueur attendent le réseau ?
  useFocusEffect(
    useCallback(() => {
      getPendingScores()
        .then((scores) => setPendingCount(scores.filter((s) => s.uid === user?.uid).length))
        .catch(() => setPendingCount(0));
    }, [user]),
  );

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>Profil</Text>

      {/* Identité du joueur */}
      <Card style={styles.card}>
        <Text style={styles.label}>Pseudo</Text>
        <Text style={styles.value}>{user?.displayName ?? '—'}</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
      </Card>

      {/* Rappel quotidien */}
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.value}>Rappel du défi quotidien</Text>
            <Text style={styles.hint}>Une notification chaque jour à 18 h</Text>
          </View>
          {reminder.isLoading ? (
            <ActivityIndicator color={colors.textMuted} />
          ) : (
            <Switch
              value={reminder.isEnabled}
              onValueChange={reminder.setEnabled}
              trackColor={{ true: colors.primary }}
            />
          )}
        </View>
        {reminder.error !== null && <Text style={styles.error}>{reminder.error}</Text>}
      </Card>

      {/* Scores gardés hors ligne */}
      {pendingCount > 0 && (
        <Card style={styles.card}>
          <Text style={styles.offline}>{pendingCount} score(s) en attente d’envoi</Text>
          <Text style={styles.hint}>Ils seront envoyés automatiquement au retour du réseau.</Text>
        </Card>
      )}

      {/* Action sur le compte : en bas, dans la zone du pouce */}
      <View style={styles.logout}>
        <Button title="Se déconnecter" variant="secondary" onPress={() => signOut()} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  logout: {
    marginTop: 'auto', // pousse le bouton tout en bas de l'écran
  },
  card: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  value: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
  offline: {
    ...typography.body,
    fontWeight: '600',
    color: colors.warning,
  },
});
