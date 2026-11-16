import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { ExpressionView } from '@/components/expression-view';
import { Keyboard } from '@/components/keyboard';
import { generateDigits } from '@/domain/generate-digits';
import { canRemove, createTokens, insertAt, removeAt } from '@/domain/tokens';
import type { Digits, Token } from '@/domain/types';
import { useShake } from '@/hooks/use-shake';

// Transforme le paramètre "482915" (envoyé par l'écran de scan) en Digits,
// ou renvoie null s'il est absent ou invalide.
function parseDigits(value: string | undefined): Digits | null {
  if (value === undefined || !/^\d{6}$/.test(value)) return null;
  const [a, b, c, d, e, f] = [...value].map(Number);
  return [a, b, c, d, e, f];
}

export default function GameScreen() {
  const params = useLocalSearchParams<{ digits?: string }>();

  // Chiffres du scan s'ils existent, sinon un tirage aléatoire
  const [digits, setDigits] = useState<Digits>(() => parseDigits(params.digits) ?? generateDigits());
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

  // Secouer le téléphone = toucher « Nouveau tirage »
  useShake(handleNewDraw);

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