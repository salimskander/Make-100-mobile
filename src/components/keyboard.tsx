import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, pressedStyle, radius, shadow, spacing, typography } from '@/constants/theme';
import type { Token } from '@/domain/types';

// label : texte affiché ; name : texte lu par les lecteurs d'écran
const KEYS: { label: string; name: string; token: Token }[] = [
  { label: '+', name: 'plus', token: { kind: 'operator', value: '+' } },
  { label: '-', name: 'moins', token: { kind: 'operator', value: '-' } },
  { label: '×', name: 'fois', token: { kind: 'operator', value: '×' } },
  { label: '/', name: 'divisé par', token: { kind: 'operator', value: '/' } },
  { label: '^', name: 'puissance', token: { kind: 'operator', value: '^' } },
  { label: '(', name: 'parenthèse ouvrante', token: { kind: 'paren', side: 'open' } },
  { label: ')', name: 'parenthèse fermante', token: { kind: 'paren', side: 'close' } },
];

type Props = {
  onKey: (token: Token) => void;
  onRemove: () => void;
};

export function Keyboard({ onKey, onRemove }: Props) {
  return (
    <View style={styles.keyboard}>
      {KEYS.map((key) => (
        <Pressable
          key={key.label}
          accessibilityRole="button"
          accessibilityLabel={key.name}
          style={({ pressed }) => [styles.key, pressed && pressedStyle]}
          onPress={() => onKey(key.token)}
        >
          <Text style={styles.label}>{key.label}</Text>
        </Pressable>
      ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="effacer"
        style={({ pressed }) => [styles.key, pressed && pressedStyle]}
        onPress={onRemove}
      >
        <Text style={styles.label}>⌫</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // 4 touches par ligne, qui s'adaptent à la largeur de l'écran
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  key: {
    flexBasis: '22%',
    flexGrow: 1,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    boxShadow: shadow.card,
  },
  label: { ...typography.heading, color: colors.text },
});
