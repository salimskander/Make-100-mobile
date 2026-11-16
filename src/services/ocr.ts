import { extractTextFromImage, isSupported } from 'expo-text-extractor';

// Garde uniquement les chiffres de tous les textes lus, dans l'ordre de lecture.
// Exemple : ["Tel 06 12", "Prix: 34€"] → [0, 6, 1, 2, 3, 4]
export function extractDigits(texts: string[]): number[] {
  return (texts.join(' ').match(/\d/g) ?? []).map(Number);
}

// Lit une photo avec ML Kit (sur le téléphone, sans Internet) et renvoie les chiffres trouvés
export async function scanDigits(photoUri: string): Promise<number[]> {
  if (!isSupported) {
    throw new Error("La lecture de texte n'est pas disponible sur cet appareil.");
  }
  const texts = await extractTextFromImage(photoUri);
  return extractDigits(texts);
}