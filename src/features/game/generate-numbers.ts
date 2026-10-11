
export function generateNumbers(): number[] {
  return Array.from(
    { length: 6 },
    () => Math.floor(Math.random() * 9) + 1
  );
}
