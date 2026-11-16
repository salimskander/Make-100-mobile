import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ExpressionView } from '@/components/expression-view';
import { Keyboard } from '@/components/keyboard';
import { checkExpression } from '@/domain/check-expression';
import { generateDigits } from '@/domain/generate-digits';
import { canRemove, createTokens, insertAt, removeAt } from '@/domain/tokens';
import type { CheckResult, Token } from '@/domain/types';

// Texte affiché sous le champ après « Valider »
function toMessage(result: CheckResult | null) {
  if (result?.status === 'wrong') return `${result.value} ≠ 100`;
  if (result?.status === 'invalid') return result.reason;
  return '';
}

export default function GameScreen() {
  const [digits, setDigits] = useState(generateDigits);
  const [tokens, setTokens] = useState(createTokens);
  const [cursor, setCursor] = useState(0);
  const [result, setResult] = useState<CheckResult | null>(null);

  // Le message s'efface tout seul après 5 secondes
  useEffect(() => {
    if (result === null) return;
    const timer = setTimeout(() => setResult(null), 5000);
    return () => clearTimeout(timer);
  }, [result]);

  function handleKey(token: Token) {
    setTokens(insertAt(tokens, cursor, token));
    setCursor(cursor + 1);
    setResult(null);
  }

  function handleRemove() {
    if (cursor === 0) return;
    if (canRemove(tokens, cursor)) setTokens(removeAt(tokens, cursor - 1));
    setCursor(cursor - 1);
    setResult(null);
  }

  function handleNewDraw() {
    setDigits(generateDigits());
    setTokens(createTokens());
    setCursor(0);
    setResult(null);
  }

  function handleValidate() {
    const checked = checkExpression(digits, tokens);
    if (checked.status === 'correct') router.replace('/result');
    else setResult(checked);
  }

  return (
    <View style={styles.container}>
      <ExpressionView digits={digits} tokens={tokens} cursor={cursor} onSelect={setCursor} />
      <Text style={styles.message}>{toMessage(result)}</Text>
      <Keyboard onKey={handleKey} onRemove={handleRemove} />
      <Button title="Valider" onPress={handleValidate} />
      <Button title="Nouveau tirage" onPress={handleNewDraw} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 24 },
  message: { fontSize: 18, textAlign: 'center', minHeight: 24 },
});
