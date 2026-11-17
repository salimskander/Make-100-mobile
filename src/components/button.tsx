import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, pressedStyle, radius, shadow, spacing, typography } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary'; // pilule noire, ou pilule blanche
  disabled?: boolean;
  loading?: boolean; // affiche un loader à la place du texte
};

export function Button({ title, onPress, variant = 'primary', disabled = false, loading = false }: Props) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && pressedStyle,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onPrimary : colors.text} />
      ) : (
        <Text style={[styles.text, { color: isPrimary ? colors.onPrimary : colors.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.full },
  primary: { backgroundColor: colors.primary, boxShadow: shadow.button },
  secondary: { backgroundColor: colors.surface, boxShadow: shadow.card },
  disabled: { opacity: 0.4 },
  text: { ...typography.body, textAlign: 'center' },
});
