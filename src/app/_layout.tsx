import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { headerOptions } from '@/constants/navigation';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export default function RootLayout() {
  const { user, isLoading } = useAuth();

  // Tant que Firebase n'a pas relu la session, on ne sait pas quel écran afficher
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.textMuted} />
      </View>
    );
  }

  const isLoggedIn = user !== null;

  return (
    <Stack screenOptions={{ ...headerOptions, contentStyle: { backgroundColor: colors.background } }}>
      {/* Écrans réservés aux joueurs connectés */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ title: 'Partie' }} />
        <Stack.Screen name="result" options={{ title: 'Résultat' }} />
        <Stack.Screen name="scan" options={{ title: 'Scanner' }} />
      </Stack.Protected>

      {/* Écrans accessibles uniquement sans être connecté */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ title: 'Connexion' }} />
        <Stack.Screen name="register" options={{ title: 'Créer un compte' }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
