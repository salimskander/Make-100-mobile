
export const MAX_LENGTH = 25;

export function buildExpression(numbers: number[], slots: string[]): string {
  return numbers.map((number, i) => slots[i] + number).join('') + slots[6];
}

export function insertSymbol(
  slots: string[],
  position: number,
  cursor: number,
  symbol: string
): string[] {
  if (slots.join('').length + 6 >= MAX_LENGTH) return slots;

  return slots.map((slot, i) =>
    i === position
      ? slot.slice(0, cursor) + symbol + slot.slice(cursor)
      : slot
  );
}

export function removeSymbol(
  slots: string[],
  position: number,
  cursor: number
): string[] {
  if (cursor === 0) return slots;

  return slots.map((slot, i) =>
    i === position
      ? slot.slice(0, cursor - 1) + slot.slice(cursor)
      : slot
  );
}
