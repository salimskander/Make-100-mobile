import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { signOut } from '@/services/auth';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Pressable onPress={() => signOut()} hitSlop={8}>
            <Text style={styles.logout}>Déconnexion</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Classement' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logout: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
