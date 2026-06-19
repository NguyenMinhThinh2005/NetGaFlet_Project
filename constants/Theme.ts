export const Theme = {
  colors: {
    bgBase: '#08080E',
    surface: '#111118',
    surfaceElevated: '#1A1A24',
    primary: '#E50914',
    primaryHover: '#FF1A1A',
    textPrimary: '#F5F5F5',
    textSecondary: '#8A8A9A',
    textTertiary: '#4A4A5A',
    divider: '#1E1E2A',
    success: '#22C55E',
    warning: '#FF8C00',
  },
  roundness: {
    card: 16,
    button: 12,
    pill: 100,
    avatar: 50,
  },
  typography: {
    fontFamily: 'System', // system default standard fonts
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 15,
      fontWeight: '600' as const,
    },
  },
  glows: {
    red: {
      shadowColor: '#E50914',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 5,
    },
    redStrong: {
      shadowColor: '#E50914',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 15,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
export default Theme;
