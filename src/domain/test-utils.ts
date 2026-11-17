import type { Digits, Operator, Token } from './types';

// Transforme un texte comme '2+3×4' en digits + tokens, pour écrire les tests simplement
export function parse(text: string) {
  const digits: number[] = [];
  const tokens: Token[] = [];
  for (const char of text) {
    if (char === '(') tokens.push({ kind: 'paren', side: 'open' });
    else if (char === ')') tokens.push({ kind: 'paren', side: 'close' });
    else if (char >= '0' && char <= '9') {
      tokens.push({ kind: 'digit', index: digits.length });
      digits.push(Number(char));
    } else tokens.push({ kind: 'operator', value: char as Operator });
  }
  // Les tests n'ont pas toujours 6 chiffres : on force le type
  return { digits: digits as unknown as Digits, tokens };
}
