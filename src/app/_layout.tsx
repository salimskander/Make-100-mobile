import { Stack } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/services/auth';

export default function RootLayout() {
  const { user, isLoading } = useAuth();

  // Tant que Firebase n'a pas relu la session, on ne sait pas quel écran afficher
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isLoggedIn = user !== null;

  return (
    <Stack>
      {/* Écrans réservés aux joueurs connectés */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Make 100',
            headerRight: () => (
              <Pressable onPress={() => signOut()} hitSlop={8}>
                <Text style={styles.logout}>Déconnexion</Text>
              </Pressable>
            ),
          }}
        />
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
  },
  logout: {
    color: '#2563EB',
    fontWeight: '600',
  },
});