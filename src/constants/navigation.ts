import { colors } from './theme';

// En-têtes communs à toute l'app (Stack et onglets) : fond gris, sans trait, texte noir
export const headerOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.text,
} as const;
