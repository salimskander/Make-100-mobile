import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { colors, typography } from '@/constants/theme';
import { tokenToText } from '@/domain/tokens';
import type { Digits, Token } from '@/domain/types';

type Props = {
  digits: Digits;
  tokens: Token[];
  cursor: number;
  onSelect: (position: number) => void;
};

export function ExpressionView({ digits, tokens, cursor, onSelect }: Props) {
  return (
    <Card style={styles.box}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="début de l'expression"
        style={styles.start}
        hitSlop={12}
        onPress={() => onSelect(0)}
      >
        {cursor === 0 && <View style={styles.cursor} />}
      </Pressable>
      {tokens.map((token, index) => (
        <Pressable key={index} accessibilityRole="button" style={styles.item} onPress={() => onSelect(index + 1)}>
          {/* Les chiffres en noir, les symboles en gris : la structure se lit d'un coup d'œil */}
          <Text style={token.kind === 'digit' ? styles.digit : styles.symbol}>{tokenToText(token, digits)}</Text>
          {cursor === index + 1 && <View style={styles.cursor} />}
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', minHeight: 96 },
  start: { width: 12, height: 48, justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', height: 48 },
  digit: { ...typography.digit, color: colors.text, paddingHorizontal: 2 },
  symbol: { ...typography.digit, color: colors.textMuted, paddingHorizontal: 2 },
  cursor: { position: 'absolute', right: -1, width: 2, height: 36, backgroundColor: colors.primary },
});
