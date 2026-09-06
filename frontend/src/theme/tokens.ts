/** Shared design tokens — elegant yellow & black theme */

export type ThemeMode = 'light' | 'dark';

export type ThemeTokens = {
  gold: string;
  goldLight: string;
  goldDark: string;
  goldMuted: string;
  bgDefault: string;
  bgPaper: string;
  bgSurface: string;
  textPrimary: string;
  textSecondary: string;
  borderGold: string;
  inputBorder: string;
  inputBorderHover: string;
  iconBg: string;
  gradients: {
    pageBackground: string;
    cardShine: string;
    goldText: string;
    accentLine: string;
  };
  shadows: {
    card: string;
  };
};

const gold = '#F5C518';
const goldLight = '#FFD95A';
const goldDark = '#C9A000';

export const darkTokens: ThemeTokens = {
  gold,
  goldLight,
  goldDark,
  goldMuted: 'rgba(245, 197, 24, 0.15)',
  bgDefault: '#0A0A0A',
  bgPaper: '#141414',
  bgSurface: '#1C1C1C',
  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  borderGold: 'rgba(245, 197, 24, 0.2)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  inputBorderHover: 'rgba(245, 197, 24, 0.2)',
  iconBg: '#0A0A0A',
  gradients: {
    pageBackground: `
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245, 197, 24, 0.12) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(245, 197, 24, 0.06) 0%, transparent 50%),
      linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)
    `,
    cardShine:
      'linear-gradient(135deg, rgba(245,197,24,0.08) 0%, transparent 50%)',
    goldText: `linear-gradient(135deg, ${goldLight} 0%, ${gold} 100%)`,
    accentLine: `linear-gradient(180deg, ${gold} 0%, transparent 100%)`,
  },
  shadows: {
    card: `
      0 24px 64px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(245, 197, 24, 0.05) inset
    `,
  },
};

export const lightTokens: ThemeTokens = {
  gold,
  goldLight,
  goldDark,
  goldMuted: 'rgba(245, 197, 24, 0.18)',
  bgDefault: '#F7F5EF',
  bgPaper: '#FFFFFF',
  bgSurface: '#FAFAF8',
  textPrimary: '#0A0A0A',
  textSecondary: '#5C5C5C',
  borderGold: 'rgba(201, 160, 0, 0.28)',
  inputBorder: 'rgba(10, 10, 10, 0.15)',
  inputBorderHover: 'rgba(201, 160, 0, 0.35)',
  iconBg: '#0A0A0A',
  gradients: {
    pageBackground: `
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245, 197, 24, 0.18) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 0% 100%, rgba(245, 197, 24, 0.08) 0%, transparent 50%),
      linear-gradient(180deg, #FFFCF5 0%, #F7F5EF 100%)
    `,
    cardShine:
      'linear-gradient(135deg, rgba(245,197,24,0.06) 0%, transparent 50%)',
    goldText: `linear-gradient(135deg, ${goldDark} 0%, ${gold} 100%)`,
    accentLine: `linear-gradient(180deg, ${goldDark} 0%, transparent 100%)`,
  },
  shadows: {
    card: `
      0 16px 48px rgba(10, 10, 10, 0.08),
      0 0 0 1px rgba(245, 197, 24, 0.08) inset
    `,
  },
};

export function getThemeTokens(mode: ThemeMode): ThemeTokens {
  return mode === 'dark' ? darkTokens : lightTokens;
}

/** @deprecated Use getThemeTokens(mode) instead */
export const colors = darkTokens;
/** @deprecated Use getThemeTokens(mode).gradients instead */
export const gradients = darkTokens.gradients;
