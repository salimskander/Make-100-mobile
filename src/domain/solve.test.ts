import { checkExpression } from './check-expression';
import { solve } from './solve';
import { parse } from './test-utils';

test.each(['152384', '999999', '123456', '482915'])('%s : la solution trouvée fait bien 100', (draw) => {
  const solution = solve(parse(draw).digits) ?? '';
  const { digits, tokens } = parse(solution);
  expect(digits.join('')).toBe(draw); // mêmes chiffres, dans le même ordre
  expect(checkExpression(digits, tokens)).toEqual({ status: 'correct' });
});

test('751111 : aucune solution', () => {
  expect(solve(parse('751111').digits)).toBeNull();
});
