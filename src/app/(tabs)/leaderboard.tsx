import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Impossible de charger le classement.</Text>
        <Pressable style={styles.button} onPress={reload}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </Pressable>
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
        <Text style={styles.message}>Aucun score pour l’instant. À toi de jouer !</Text>
      }
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <Text style={styles.rank}>{index + 1}</Text>
          <View style={styles.info}>
            <Text style={styles.pseudo}>{item.pseudo}</Text>
            <Text style={styles.digits}>{item.digits}</Text>
          </View>
          <Text style={styles.time}>{formatTime(item.timeMs)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 28,
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  pseudo: {
    fontSize: 16,
    fontWeight: '600',
  },
  digits: {
    color: '#64748B',
    letterSpacing: 2,
  },
  time: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
});