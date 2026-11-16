import type { CheckResult, Digits, Token } from './types';

const TARGET = 100;

export function checkExpression(digits: Digits, tokens: Token[]): CheckResult {
  let position = 0; // index du token en cours de lecture

  function currentOperator() {
    const token = tokens[position];
    return token?.kind === 'operator' ? token.value : null;
  }

  // Chiffres collés = un seul nombre : 1, 5, 3 → 153
  function readNumber() {
    let text = '';
    let token = tokens[position];
    while (token?.kind === 'digit') {
      text += digits[token.index];
      position++;
      token = tokens[position];
    }
    if (text === '') throw new Error('Opération invalide');
    if (text.length > 1 && text[0] === '0') throw new Error('Un nombre ne commence pas par 0');
    return Number(text);
  }

  // Un nombre, ou un calcul entre parenthèses
  function readBlock(): number {
    const token = tokens[position];
    if (token?.kind !== 'paren' || token.side !== 'open') return readNumber();
    position++;
    const value = readSum();
    const close = tokens[position];
    if (close?.kind !== 'paren' || close.side !== 'close') throw new Error('Parenthèse non fermée');
    position++;
    return value;
  }

  // Moins devant, puis bloc, puis éventuellement ^ suivi uniquement de chiffres
  function readPower(): number {
    if (currentOperator() === '-') {
      position++;
      return -readPower();
    }
    const base = readBlock();
    if (currentOperator() !== '^') return base;
    position++;
    if (tokens[position]?.kind !== 'digit') throw new Error("L'exposant ne contient que des chiffres");
    return base ** readNumber();
  }

  function readProduct() {
    let value = readPower();
    while (currentOperator() === '×' || currentOperator() === '/') {
      const operator = currentOperator();
      position++;
      const right = readPower();
      if (operator === '/' && right === 0) throw new Error('Division par zéro');
      value = operator === '×' ? value * right : value / right;
    }
    return value;
  }

  function readSum() {
    let value = readProduct();
    while (currentOperator() === '+' || currentOperator() === '-') {
      const operator = currentOperator();
      position++;
      const right = readProduct();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }

  try {
    const value = readSum();
    if (position < tokens.length) throw new Error('Expression mal formée');
    if (!Number.isFinite(value)) throw new Error('Nombre trop grand');
    return Math.abs(value - TARGET) < 1e-9 ? { status: 'correct' } : { status: 'wrong', value };
  } catch (error) {
    return { status: 'invalid', reason: (error as Error).message };
  }
}
