import type { Digits } from './types';

// Pour un morceau de chiffres : valeur obtenue → une expression qui la donne
type Found = Map<number, string>;

export function solve(digits: Digits): string | null {
  const memory = new Map<string, Found>();

  function valuesOf(start: number, end: number): Found {
    const key = `${start}-${end}`;
    const known = memory.get(key);
    if (known) return known;

    const found: Found = new Map();
    const glued = digits.slice(start, end).join(''); // chiffres collés : 1, 5, 3 → '153'
    if (glued.length === 1 || glued[0] !== '0') found.set(Number(glued), glued);

    // On coupe le morceau en deux à chaque endroit, et on combine les deux côtés
    for (let split = start + 1; split < end; split++) {
      const rightGlued = digits.slice(split, end).join('');
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

  for (const [value, expression] of valuesOf(0, digits.length)) {
    if (Math.abs(value - 100) < 1e-9) return expression;
  }
  return null;
}

// Garde la première expression trouvée pour chaque valeur, et ignore les nombres infinis
function keep(found: Found, value: number, expression: string) {
  if (Number.isFinite(value) && !found.has(value)) found.set(value, expression);
}
