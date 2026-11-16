import { router, useLocalSearchParams } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ResultScreen() {
  const { ms, expression, solution } = useLocalSearchParams<{ ms?: string; expression?: string; solution?: string }>();
  const won = solution === undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.expression}>{won ? `${expression} = 100` : solution}</Text>
      <Text style={styles.title}>{won ? 'Bravo !' : 'Dommage !'}</Text>
      {won && <Text style={styles.time}>{(Number(ms) / 1000).toFixed(2)} s</Text>}
      <Button title="Rejouer" onPress={() => router.replace('/game')} />
      <Button title="Retour à l'accueil" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24 },
  expression: { fontSize: 24, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 'bold' },
  time: { fontSize: 24, fontVariant: ['tabular-nums'] },
});
