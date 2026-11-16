import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Digits, Token } from '@/domain/types';

type Props = {
  digits: Digits;
  tokens: Token[];
  cursor: number;
  onSelect: (position: number) => void;
};

function toText(token: Token, digits: Digits) {
  if (token.kind === 'digit') return String(digits[token.index]);
  if (token.kind === 'operator') return token.value;
  return token.side === 'open' ? '(' : ')';
}

export function ExpressionView({ digits, tokens, cursor, onSelect }: Props) {
  return (
    <View style={styles.box}>
      <Pressable style={styles.start} hitSlop={12} onPress={() => onSelect(0)}>
        {cursor === 0 && <View style={styles.cursor} />}
      </Pressable>
      {tokens.map((token, index) => (
        <Pressable key={index} style={styles.item} onPress={() => onSelect(index + 1)}>
          <Text style={styles.text}>{toText(token, digits)}</Text>
          {cursor === index + 1 && <View style={styles.cursor} />}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12 },
  start: { width: 12, height: 40, justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', height: 40 },
  text: { fontSize: 28, paddingHorizontal: 2 },
  cursor: { position: 'absolute', right: -1, width: 2, height: 30, backgroundColor: '#2563EB' },
});
