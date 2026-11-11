import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="game" options={{ title: 'Partie' }} />
      <Stack.Screen name="result" options={{ title: 'Résultat' }} />
    </Stack>
  );
}
