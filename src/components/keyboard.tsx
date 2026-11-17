import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Token } from '@/domain/types';

const KEYS: { label: string; token: Token }[] = [
  { label: '+', token: { kind: 'operator', value: '+' } },
  { label: '-', token: { kind: 'operator', value: '-' } },
  { label: '×', token: { kind: 'operator', value: '×' } },
  { label: '/', token: { kind: 'operator', value: '/' } },
  { label: '^', token: { kind: 'operator', value: '^' } },
  { label: '(', token: { kind: 'paren', side: 'open' } },
  { label: ')', token: { kind: 'paren', side: 'close' } },
];

type Props = {
  onKey: (token: Token) => void;
  onRemove: () => void;
};

export function Keyboard({ onKey, onRemove }: Props) {
  return (
    <View style={styles.keyboard}>
      {KEYS.map((key) => (
        <Pressable key={key.label} style={styles.key} onPress={() => onKey(key.token)}>
          <Text style={styles.label}>{key.label}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.key} onPress={onRemove}>
        <Text style={styles.label}>⌫</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  key: { width: 64, height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#E5E7EB' },
  label: { fontSize: 26 },
});
