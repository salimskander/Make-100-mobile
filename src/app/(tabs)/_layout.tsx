import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { headerOptions } from '@/constants/navigation';
import { colors, spacing, typography } from '@/constants/theme';
import { signOut } from '@/services/auth';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        ...headerOptions,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.separator },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        headerRight: () => (
          <Pressable accessibilityRole="button" onPress={() => signOut()} hitSlop={12}>
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
    ...typography.body,
    color: colors.text,
    marginRight: spacing.lg,
  },
});
