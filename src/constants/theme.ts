// Toutes les valeurs de design de l'app : aucun écran n'écrit de couleur ou de taille en dur

export const colors = {
  background: '#F5F5F7', // fond des écrans
  surface: '#FFFFFF', // cartes, tuiles, touches
  separator: '#D2D2D7', // séparateurs fins de listes
  text: '#1D1D1F', // texte principal, chiffres
  textMuted: '#6E6E73', // texte secondaire, opérateurs
  primary: '#1D1D1F', // bouton principal, curseur (noir)
  onPrimary: '#FFFFFF', // texte posé sur primary
  success: '#1A7F37',
  error: '#D70015',
  warning: '#A05A00',
  gold: '#B8860B', // couronne du premier du classement, seule couleur « honorifique »
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 } as const;

export const radius = { md: 12, lg: 18, full: 999 } as const;

export const shadow = {
  card: '0 2px 12px rgba(0, 0, 0, 0.06)', // cartes, tuiles, pilule blanche
  button: '0 6px 16px rgba(0, 0, 0, 0.18)', // pilule noire, l'action principale
} as const;

// Retour visuel commun à tout élément appuyé : il s'enfonce légèrement
export const pressedStyle = { opacity: 0.85, transform: [{ scale: 0.97 }] };

export const typography = {
  hero: { fontSize: 64, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  digit: { fontSize: 36, fontWeight: '700' },
  heading: { fontSize: 22, fontWeight: '600' },
  body: { fontSize: 17, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const;
