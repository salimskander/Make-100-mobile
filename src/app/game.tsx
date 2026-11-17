import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { ExpressionView } from '@/components/expression-view';
import { Keyboard } from '@/components/keyboard';
import { colors, spacing, typography } from '@/constants/theme';
import { checkExpression } from '@/domain/check-expression';
import { generateDigits } from '@/domain/generate-digits';
import { solve } from '@/domain/solve';
import { canRemove, createTokens, insertAt, removeAt, tokenToText } from '@/domain/tokens';
import type { CheckResult, Digits, Token } from '@/domain/types';
import { useShake } from '@/hooks/use-shake';
import { useTimer } from '@/hooks/use-timer';

// Transforme le paramètre "482915" (envoyé par l'écran de scan) en Digits,
// ou renvoie null s'il est absent ou invalide.
function parseDigits(value: string | undefined): Digits | null {
  if (value === undefined || !/^[1-9]{6}$/.test(value)) return null;
  const [a, b, c, d, e, f] = [...value].map(Number);
  return [a, b, c, d, e, f];
}

// Texte affiché sous le champ après « Valider »
function toMessage(result: CheckResult | null) {
  if (result?.status === 'wrong') return `${result.value} ≠ 100`;
  if (result?.status === 'invalid') return result.reason;
  return '';
}

export default function GameScreen() {
  const params = useLocalSearchParams<{ digits?: string }>();

  // Chiffres du scan s'ils existent, sinon un tirage aléatoire
  const [digits, setDigits] = useState<Digits>(() => parseDigits(params.digits) ?? generateDigits());
  const [tokens, setTokens] = useState(createTokens);
  const [cursor, setCursor] = useState(0);
  const [result, setResult] = useState<CheckResult | null>(null);
  const timer = useTimer();

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
    timer.reset();
  }

  function handleValidate() {
    const checked = checkExpression(digits, tokens);
    if (checked.status !== 'correct') return setResult(checked);
    const expression = tokens.map((token) => tokenToText(token, digits)).join('');
    router.replace({ pathname: '/result', params: { ms: timer.elapsedMs(), expression } });
  }

  function handleGiveUp() {
    const solution = solve(digits);
    router.replace({ pathname: '/result', params: { solution: solution ? `${solution} = 100` : 'Résultat impossible' } });
  }

  // Secouer le téléphone = toucher « Nouveau tirage »
  useShake(handleNewDraw);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer.seconds} s</Text>

      <Animated.View entering={FadeInDown.duration(600)} style={styles.board}>
        <ExpressionView digits={digits} tokens={tokens} cursor={cursor} onSelect={setCursor} />
        <Text style={styles.message}>{toMessage(result)}</Text>
      </Animated.View>

      <View style={styles.controls}>
        <Keyboard onKey={handleKey} onRemove={handleRemove} />
        <Button title="Valider" onPress={handleValidate} />
        <View style={styles.row}>
          <View style={styles.half}>
            <Button title="Abandonner" variant="secondary" onPress={handleGiveUp} />
          </View>
          <View style={styles.half}>
            <Button title="Nouveau tirage" variant="secondary" onPress={handleNewDraw} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, gap: spacing.xl },
  timer: { ...typography.title, color: colors.text, textAlign: 'center', fontVariant: ['tabular-nums'] },
  board: { flex: 1, justifyContent: 'center', gap: spacing.md },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center', minHeight: 24 },
  controls: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
});
