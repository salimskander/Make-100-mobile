import { Tabs } from 'expo-router';
import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, Text, type ColorValue } from 'react-native';

import { headerOptions } from '@/constants/navigation';
import { colors, spacing, typography } from '@/constants/theme';
import { useScoreSync } from '@/hooks/use-score-sync';
import { signOut } from '@/services/auth';

// Icône d'onglet : contour si inactif, pleine si actif (iOS). Couleur et taille viennent de la barre.
function tabIcon(outline: SFSymbol, filled: SFSymbol, material: AndroidSymbol) {
  return function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    return (
      <SymbolView
        name={{ ios: focused ? filled : outline, android: material, web: material }}
        tintColor={color}
        size={size}
      />
    );
  };
}

export default function TabLayout() {
  // Envoie les scores gardés hors ligne dès que le réseau est disponible
  useScoreSync();

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
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: tabIcon('house', 'house.fill', 'home') }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ title: 'Classement', tabBarIcon: tabIcon('trophy', 'trophy.fill', 'trophy') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarIcon: tabIcon('person', 'person.fill', 'person') }}
      />
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