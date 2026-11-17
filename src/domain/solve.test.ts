import { checkExpression } from './check-expression';
import { solve } from './solve';
import { parse } from './test-utils';

test.each(['152384', '999999', '123456', '482915', '751111'])('%s : la solution trouvée fait bien 100', (draw) => {
  const solution = solve(parse(draw).digits) ?? '';
  const { digits, tokens } = parse(solution);
  expect(digits.join('')).toBe(draw); // mêmes chiffres, dans le même ordre
  expect(checkExpression(digits, tokens)).toEqual({ status: 'correct' });
});

test('611311 : aucune solution, même avec le moins devant', () => {
  expect(solve(parse('611311').digits)).toBeNull();
});
