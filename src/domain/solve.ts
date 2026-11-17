import type { Digits, Operator } from './types';

// Une expression écrite, avec le niveau de sa dernière opération (pour les parenthèses)
type Expr = { text: string; level: number };

// Pour un morceau de chiffres : valeur obtenue → une expression qui la donne
type Found = Map<number, Expr>;

// Priorité de chaque opération : 1 = + -, 2 = × /, 3 = ^ (un nombre seul vaut 4)
const LEVEL: Record<Operator, number> = { '+': 1, '-': 1, '×': 2, '/': 2, '^': 3 };

// Fins de calcul qu'un humain cherche en premier : gauche × droite = 100 (dans les deux ordres)
const HUMAN_PRODUCTS = [
  [10, 10],
  [50, 2],
  [4, 25],
  [5, 20],
  [8, 12.5],
];

export function solve(digits: Digits): string | null {
  const memory = new Map<string, Found>();
  const last = digits.length;
  const glue = (start: number, end: number) => digits.slice(start, end).join(''); // 1, 5, 3 → '153'

  function valuesOf(start: number, end: number): Found {
    const key = `${start}-${end}`;
    const known = memory.get(key);
    if (known) return known;

    const found: Found = new Map();
    const glued = glue(start, end);
    if (glued.length === 1 || glued[0] !== '0') {
      found.set(Number(glued), { text: glued, level: 4 });
      // Moins devant le premier nombre (-7-5+1+111) : un moins ailleurs se réécrit en soustraction.
      // -7 se comporte comme un produit : -7×3 se lit bien (-7)×3, mais -7^2 non.
      if (start === 0) found.set(-Number(glued), { text: `-${glued}`, level: 2 });
    }

    // On coupe le morceau en deux à chaque endroit, et on combine les deux côtés
    for (let split = start + 1; split < end; split++) {
      const exponent: Expr = { text: glue(split, end), level: 4 };
      for (const [a, left] of valuesOf(start, split)) {
        for (const [b, right] of valuesOf(split, end)) {
          keep(found, a + b, combine(left, '+', right));
          keep(found, a - b, combine(left, '-', right));
          keep(found, a * b, combine(left, '×', right));
          if (b !== 0) keep(found, a / b, combine(left, '/', right));
        }
        // Exposant : uniquement des chiffres collés, comme dans checkExpression
        keep(found, a ** Number(exponent.text), combine(left, '^', exponent));
      }
    }

    memory.set(key, found);
    return found;
  }

  // 1. Finir par 10×10, 50×2, 4×25, 5×20, 8×12,5 ou 10^2 : chaque côté fait librement son nombre
  function productEnding(): Expr | null {
    for (let split = 1; split < last; split++) {
      const left = valuesOf(0, split);
      const right = valuesOf(split, last);
      for (const [a, b] of HUMAN_PRODUCTS) {
        const leftA = left.get(a);
        const rightB = right.get(b);
        if (leftA && rightB) return combine(leftA, '×', rightB);
        const leftB = left.get(b);
        const rightA = right.get(a);
        if (leftB && rightA) return combine(leftB, '×', rightA);
      }
      const ten = left.get(10);
      if (ten && glue(split, last) === '2') return combine(ten, '^', { text: '2', level: 4 });
    }
    return null;
  }

  // 2. Sinon, un grand nombre collé (70 ou plus), complété par ce qui est avant (+) et après (+ ou -)
  function bigNumberEnding(): Expr | null {
    const nothing: Found = new Map([[0, { text: '', level: 4 }]]); // côté vide : vaut 0 et ne s'écrit pas
    for (let start = 0; start < last; start++) {
      for (let end = start + 2; end <= last; end++) {
        const big: Expr = { text: glue(start, end), level: 4 };
        if (big.text[0] === '0' || Number(big.text) < 70) continue;
        const before = start > 0 ? valuesOf(0, start) : nothing;
        const after = end < last ? valuesOf(end, last) : nothing;
        for (const [a, beforeExpr] of before) {
          const missing = 100 - a - Number(big.text); // ce que la partie d'après doit apporter
          const head = beforeExpr.text === '' ? big : combine(beforeExpr, '+', big);
          const added = after.get(missing);
          if (added) return added.text === '' ? head : combine(head, '+', added);
          const removed = after.get(-missing);
          if (removed) return combine(head, '-', removed);
        }
      }
    }
    return null;
  }

  // 3. Sinon, n'importe quelle expression qui fait 100
  function anyEnding(): Expr | null {
    for (const [value, expression] of valuesOf(0, last)) {
      if (Math.abs(value - 100) < 1e-9) return expression;
    }
    return null;
  }

  return (productEnding() ?? bigNumberEnding() ?? anyEnding())?.text ?? null;
}

// Assemble deux expressions, avec des parenthèses seulement si le calcul changerait sans elles :
// - un côté plus faible que l'opération : (8+1)×3
// - à droite d'un - ou d'un /, un côté de même niveau : 9-(4-1)
// - la base d'une puissance qui n'est pas un nombre seul : (1+5)^2
function combine(left: Expr, operator: Operator, right: Expr): Expr {
  const level = LEVEL[operator];
  const leftNeeds = left.level < level || (operator === '^' && left.level < 4);
  const rightNeeds = right.level < level || (right.level === level && (operator === '-' || operator === '/'));
  const leftText = leftNeeds ? `(${left.text})` : left.text;
  const rightText = rightNeeds ? `(${right.text})` : right.text;
  return { text: `${leftText}${operator}${rightText}`, level };
}

// Garde la première expression trouvée pour chaque valeur, et ignore les nombres infinis
function keep(found: Found, value: number, expression: Expr) {
  if (Number.isFinite(value) && !found.has(value)) found.set(value, expression);
}
