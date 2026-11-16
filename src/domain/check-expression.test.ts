import { checkExpression } from './check-expression';
import type { Digits, Operator, Token } from './types';

// Transforme un texte comme '2+3×4' en digits + tokens, pour écrire les tests simplement
function check(text: string) {
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
  // Les tests n'ont pas toujours 6 chiffres : on force le type, la fonction lit juste digits[index]
  return checkExpression(digits as unknown as Digits, tokens);
}

test.each([
  // Résultats justes
  ['(1+5)^2×3-8', { status: 'correct' }],
  ['12×8+4', { status: 'correct' }],
  ['1/3×300', { status: 'correct' }], // arrondi de JavaScript toléré

  // Résultats faux, avec la valeur calculée
  ['2+3×4', { status: 'wrong', value: 14 }], // priorités
  ['-153×1+32', { status: 'wrong', value: -121 }], // moins devant
  ['-2^2', { status: 'wrong', value: -4 }],
  ['(-2)^2', { status: 'wrong', value: 4 }],
  ['--3', { status: 'wrong', value: 3 }],
  ['2^12', { status: 'wrong', value: 4096 }],

  // Expressions refusées, avec la raison
  ['2^(1+2)', { status: 'invalid', reason: "L'exposant ne contient que des chiffres" }],
  ['2^-3', { status: 'invalid', reason: "L'exposant ne contient que des chiffres" }],
  ['2^3^2', { status: 'invalid', reason: 'Expression mal formée' }],
  ['5/(3-3)', { status: 'invalid', reason: 'Division par zéro' }],
  ['(1+2', { status: 'invalid', reason: 'Parenthèse non fermée' }],
  ['1+2)', { status: 'invalid', reason: 'Expression mal formée' }],
  ['1+×2', { status: 'invalid', reason: 'Opération invalide' }],
  ['05+1', { status: 'invalid', reason: 'Un nombre ne commence pas par 0' }],
  ['9^99999', { status: 'invalid', reason: 'Nombre trop grand' }],
])('%s', (text, expected) => {
  expect(check(text)).toEqual(expected);
});
