import type { Digits } from './types';

// Pour un morceau de chiffres : valeur obtenue → une expression qui la donne
type Found = Map<number, string>;

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
      found.set(Number(glued), glued);
      // Moins devant le premier nombre (-7-5+1+111) : un moins ailleurs se réécrit en soustraction
      if (start === 0) found.set(-Number(glued), `(-${glued})`);
    }

    // On coupe le morceau en deux à chaque endroit, et on combine les deux côtés
    for (let split = start + 1; split < end; split++) {
      const rightGlued = glue(split, end);
      for (const [a, left] of valuesOf(start, split)) {
        for (const [b, right] of valuesOf(split, end)) {
          keep(found, a + b, `(${left}+${right})`);
          keep(found, a - b, `(${left}-${right})`);
          keep(found, a * b, `(${left}×${right})`);
          if (b !== 0) keep(found, a / b, `(${left}/${right})`);
        }
        // Exposant : uniquement des chiffres collés, comme dans checkExpression
        keep(found, a ** Number(rightGlued), `(${left}^${rightGlued})`);
      }
    }

    memory.set(key, found);
    return found;
  }

  // 1. Finir par 10×10, 50×2, 4×25, 5×20, 8×12,5 ou 10^2 : chaque côté fait librement son nombre
  function productEnding(): string | null {
    for (let split = 1; split < last; split++) {
      const left = valuesOf(0, split);
      const right = valuesOf(split, last);
      for (const [a, b] of HUMAN_PRODUCTS) {
        if (left.has(a) && right.has(b)) return `${left.get(a)}×${right.get(b)}`;
        if (left.has(b) && right.has(a)) return `${left.get(b)}×${right.get(a)}`;
      }
      if (left.has(10) && glue(split, last) === '2') return `${left.get(10)}^2`;
    }
    return null;
  }

  // 2. Sinon, un grand nombre collé (70 ou plus), complété par ce qui est avant (+) et après (+ ou -)
  function bigNumberEnding(): string | null {
    const nothing: Found = new Map([[0, '']]); // côté vide : vaut 0 et ne s'écrit pas
    for (let start = 0; start < last; start++) {
      for (let end = start + 2; end <= last; end++) {
        const big = glue(start, end);
        if (big[0] === '0' || Number(big) < 70) continue;
        const before = start > 0 ? valuesOf(0, start) : nothing;
        const after = end < last ? valuesOf(end, last) : nothing;
        for (const [a, beforeText] of before) {
          const missing = 100 - a - Number(big); // ce que la partie d'après doit apporter
          const head = beforeText === '' ? big : `${beforeText}+${big}`;
          const added = after.get(missing);
          if (added !== undefined) return added === '' ? head : `${head}+${added}`;
          const removed = after.get(-missing);
          if (removed !== undefined) return `${head}-${removed}`;
        }
      }
    }
    return null;
  }

  // 3. Sinon, n'importe quelle expression qui fait 100
  function anyEnding(): string | null {
    for (const [value, expression] of valuesOf(0, last)) {
      if (Math.abs(value - 100) < 1e-9) return expression;
    }
    return null;
  }

  return productEnding() ?? bigNumberEnding() ?? anyEnding();
}

// Garde la première expression trouvée pour chaque valeur, et ignore les nombres infinis
function keep(found: Found, value: number, expression: string) {
  if (Number.isFinite(value) && !found.has(value)) found.set(value, expression);
}
