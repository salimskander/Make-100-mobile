import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { colors, spacing, typography } from '@/constants/theme';
import { useLeaderboard } from '@/hooks/use-leaderboard';

// 42300 ms → "42,3 s" ; 75000 ms → "1 min 15 s"
function formatTime(timeMs: number): string {
  const totalSeconds = timeMs / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1).replace('.', ',')} s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes} min ${seconds.toString().padStart(2, '0')} s`;
}

export default function LeaderboardScreen() {
  const { scores, status, reload } = useLeaderboard();

  if (status === 'loading' && scores.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.textMuted} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Impossible de charger le classement.</Text>
        <Button title="Réessayer" onPress={reload} />
      </View>
    );
  }

  return (
    <FlatList
      data={scores}
      keyExtractor={(score) => score.id}
      onRefresh={reload}
      refreshing={status === 'loading'}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.message}>Aucun score pour l’instant. À toi de jouer !</Text>
          <Button title="Jouer" variant="secondary" onPress={() => router.push('/game')} />
        </View>
      }
      renderItem={({ item, index }) => (
        <Card style={styles.row}>
          <Text style={styles.rank}>{index + 1}</Text>
          <View style={styles.info}>
            <Text style={styles.pseudo}>{item.pseudo}</Text>
            <Text style={styles.digits}>{item.digits}</Text>
          </View>
          <Text style={styles.time}>{formatTime(item.timeMs)}</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.xxl,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rank: {
    ...typography.heading,
    color: colors.textMuted,
    width: 32,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  pseudo: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  digits: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  time: {
    ...typography.body,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
});
