import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { ExpressionView } from '@/components/expression-view';
import { Keyboard } from '@/components/keyboard';
import { generateDigits } from '@/domain/generate-digits';
import { canRemove, createTokens, insertAt, removeAt } from '@/domain/tokens';
import type { Token } from '@/domain/types';

export default function GameScreen() {
  const [digits, setDigits] = useState(generateDigits);
  const [tokens, setTokens] = useState(createTokens);
  const [cursor, setCursor] = useState(0);

  function handleKey(token: Token) {
    setTokens(insertAt(tokens, cursor, token));
    setCursor(cursor + 1);
  }

  function handleRemove() {
    if (cursor === 0) return;
    if (canRemove(tokens, cursor)) setTokens(removeAt(tokens, cursor - 1));
    setCursor(cursor - 1);
  }

  function handleNewDraw() {
    setDigits(generateDigits());
    setTokens(createTokens());
    setCursor(0);
  }

  return (
    <View style={styles.container}>
      <ExpressionView digits={digits} tokens={tokens} cursor={cursor} onSelect={setCursor} />
      <Keyboard onKey={handleKey} onRemove={handleRemove} />
      <Button title="Nouveau tirage" onPress={handleNewDraw} />
      <Button title="Voir le résultat" onPress={() => router.replace('/result')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 24 },
});
