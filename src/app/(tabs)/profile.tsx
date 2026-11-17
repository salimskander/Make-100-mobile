import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { useDailyReminder } from '@/hooks/use-daily-reminder';
import { getPendingScores } from '@/services/score-queue';

export default function ProfileScreen() {
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
    <View style={styles.container}>
      {/* Identité du joueur */}
      <View style={styles.card}>
        <Text style={styles.label}>Pseudo</Text>
        <Text style={styles.value}>{user?.displayName ?? '—'}</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
      </View>

      {/* Rappel quotidien */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.value}>Rappel du défi quotidien</Text>
            <Text style={styles.hint}>Une notification chaque jour à 18 h</Text>
          </View>
          {reminder.isLoading ? (
            <ActivityIndicator />
          ) : (
            <Switch value={reminder.isEnabled} onValueChange={reminder.setEnabled} />
          )}
        </View>
        {reminder.error !== null && <Text style={styles.error}>{reminder.error}</Text>}
      </View>

      {/* Scores gardés hors ligne */}
      {pendingCount > 0 && (
        <View style={styles.card}>
          <Text style={styles.value}>
            {pendingCount} score(s) en attente d’envoi
          </Text>
          <Text style={styles.hint}>Ils seront envoyés automatiquement au retour du réseau.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  label: {
    color: '#64748B',
    fontSize: 13,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    color: '#64748B',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  error: {
    color: '#DC2626',
  },
});