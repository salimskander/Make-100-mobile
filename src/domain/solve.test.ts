import { checkExpression } from './check-expression';
import { solve } from './solve';
import { parse } from './test-utils';

test.each(['152384', '999999', '123456', '482915', '751111'])('%s : la solution trouvée fait bien 100', (draw) => {
  const solution = solve(parse(draw).digits) ?? '';
  const { digits, tokens } = parse(solution);
  expect(digits.join('')).toBe(draw); // mêmes chiffres, dans le même ordre
  expect(checkExpression(digits, tokens)).toEqual({ status: 'correct' });
});

// Le solveur préfère les fins « humaines » : un produit qui fait 100, ou un grand nombre complété
test('978511 : finit par 10 × 10', () => {
  expect(solve(parse('978511').digits)).toBe('(9-(7-8))×5×(1+1)');
});

test('936461 : part du grand nombre 93', () => {
  expect(solve(parse('936461').digits)).toBe('93+6-(4-(6-1))');
});

test('763811 : seulement les parenthèses utiles', () => {
  expect(solve(parse('763811').digits)).toBe('(7+6-3)×(8+1+1)');
});

test('611311 : aucune solution, même avec le moins devant', () => {
  expect(solve(parse('611311').digits)).toBeNull();
});
