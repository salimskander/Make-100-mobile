import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from './theme';

// Styles communs aux formulaires de connexion et d'inscription
export const formStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
  success: {
    ...typography.caption,
    color: colors.success,
  },
});
