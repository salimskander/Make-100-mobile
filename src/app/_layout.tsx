import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ title: 'Partie' }} />
      <Stack.Screen name="result" options={{ title: 'Résultat' }} />
      <Stack.Screen name="scan" options={{ title: 'Scanner' }} />
    </Stack>
  );
}
