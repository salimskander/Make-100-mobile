// Garde uniquement les chiffres de tous les textes lus, dans l'ordre de lecture.
// Exemple : ["Tel 06 12", "Prix: 34€"] → [0, 6, 1, 2, 3, 4]
export function extractDigits(texts: string[]): number[] {
  return (texts.join(' ').match(/\d/g) ?? []).map(Number);
}

// Lit une photo avec ML Kit (sur le téléphone, sans Internet) et renvoie les chiffres trouvés
export async function scanDigits(photoUri: string): Promise<number[]> {
  // Import dynamique : la bibliothèque n'est chargée qu'ici. Dans Expo Go, où le module
  // natif de l'OCR n'existe pas, l'app démarre quand même et seul le scan est indisponible.
  let textExtractor: typeof import('expo-text-extractor');
  try {
    textExtractor = await import('expo-text-extractor');
  } catch {
    throw new Error(
      "La lecture de texte n'est pas disponible ici : elle nécessite le build de développement.",
    );
  }

  if (!textExtractor.isSupported) {
    throw new Error("La lecture de texte n'est pas disponible sur cet appareil.");
  }
  const texts = await textExtractor.extractTextFromImage(photoUri);
  return extractDigits(texts);
}