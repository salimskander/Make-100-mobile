export type Digits = readonly [number, number, number, number, number, number];

export type Operator = '+' | '-' | '×' | '/' | '^';

// Le joueur n'ajoute que des opérateurs et des parenthèses :
// les chiffres restent fixes, dans l'ordre.
export type Token =
  | { kind: 'digit'; index: number }
  | { kind: 'operator'; value: Operator }
  | { kind: 'paren'; side: 'open' | 'close' };

export type CheckResult =
  | { status: 'correct' }
  | { status: 'wrong'; value: number }
  | { status: 'invalid'; reason: string };
