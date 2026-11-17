import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { colors, spacing, typography } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
        <Text style={styles.title}>Make 100</Text>
        <Text style={styles.subtitle}>Six chiffres. Un seul objectif.</Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.actions}>
        <Button title="Jouer" onPress={() => router.push('/game')} />
        <Button title="Scanner un tirage" variant="secondary" onPress={() => router.push('/scan')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.hero, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  actions: { gap: spacing.md, paddingBottom: spacing.lg },
});
