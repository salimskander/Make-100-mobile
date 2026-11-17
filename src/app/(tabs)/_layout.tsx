import { Tabs } from 'expo-router';
import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { colors } from '@/constants/theme';
import { useScoreSync } from '@/hooks/use-score-sync';

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
        headerShown: false, // pas de barre de titre : chaque onglet affiche son propre grand titre
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.separator },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
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
