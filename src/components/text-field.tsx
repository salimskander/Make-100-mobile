import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/constants/theme';

// Champ de saisie du thème : accepte toutes les props d'un TextInput classique
export function TextField(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.textMuted} {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    boxShadow: shadow.card,
  },
});
