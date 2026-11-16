import type { Digits } from './types';

function randomDigit() {
  return Math.floor(Math.random() * 9) + 1;
}

export function generateDigits(): Digits {
  return [randomDigit(), randomDigit(), randomDigit(), randomDigit(), randomDigit(), randomDigit()];
}
