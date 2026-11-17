import type { Digits, Token } from './types';

// Au départ, l'expression ne contient que les 6 chiffres
export function createTokens(): Token[] {
  return [0, 1, 2, 3, 4, 5].map((index) => ({ kind: 'digit', index }));
}

export function insertAt(tokens: Token[], index: number, token: Token) {
  return [...tokens.slice(0, index), token, ...tokens.slice(index)];
}

export function removeAt(tokens: Token[], index: number) {
  return [...tokens.slice(0, index), ...tokens.slice(index + 1)];
}

// On ne peut effacer que ce qui est juste avant le curseur, et jamais un chiffre
export function canRemove(tokens: Token[], cursor: number) {
  return cursor > 0 && tokens[cursor - 1].kind !== 'digit';
}

// Texte affiché pour un token : le chiffre du tirage, l'opérateur ou la parenthèse
export function tokenToText(token: Token, digits: Digits) {
  if (token.kind === 'digit') return String(digits[token.index]);
  if (token.kind === 'operator') return token.value;
  return token.side === 'open' ? '(' : ')';
}
