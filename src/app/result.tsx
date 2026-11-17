import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { colors, spacing, typography } from '@/constants/theme';

export default function ResultScreen() {
  const { ms, expression, solution } = useLocalSearchParams<{ ms?: string; expression?: string; solution?: string }>();
  const won = solution === undefined;

  return (
    // Zone sûre du bas : les boutons restent au-dessus de la barre de navigation du téléphone
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
        <Text style={[styles.title, won && styles.success]}>{won ? 'Bravo.' : 'Dommage.'}</Text>
        {won && <Text style={styles.time}>{(Number(ms) / 1000).toFixed(2)} s</Text>}
        <Card>
          <Text style={styles.expression}>{won ? `${expression} = 100` : solution}</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.actions}>
        <Button title="Rejouer" onPress={() => router.replace('/game')} />
        <Button title="Retour à l'accueil" variant="secondary" onPress={() => router.back()} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  title: { ...typography.title, color: colors.text, textAlign: 'center' },
  success: { color: colors.success },
  time: { ...typography.hero, color: colors.text, textAlign: 'center', fontVariant: ['tabular-nums'] },
  expression: { ...typography.body, color: colors.text, textAlign: 'center' },
  actions: { gap: spacing.md, paddingBottom: spacing.lg },
});
