/**
 * Oracle Design System
 * Colors and typography for light and dark mode.
 */
import { ThemeContext } from '@/context/theme-context';
import { useContext } from 'react';
import { Platform } from 'react-native';

const tintColorLight = '#7B97C4'; 
const tintColorDark  = '#00F2FF'; 

export const Colors = {
  light: {
    text:            '#1A2340',
    background:      '#F2F2F7', 
    tint:            tintColorLight,
    icon:            '#5A6A8A',
    tabIconDefault:  '#9AA8C0',
    tabIconSelected: tintColorLight,

    // Surfaces
    bgMid:           '#E6F0FF', 
    bgCard:          'rgba(255, 255, 255, 0.7)', 
    bgCardBorder:    'rgba(255, 255, 255, 0.5)',

    // Text scale
    textPrimary:     '#1A2340',
    textSecondary:   '#5A6A8A',
    textDim:         '#9AA8C0',
    textMuted:       '#C4CDD8',

    // Accent — Fluid Iridescence
    accentPrimary:   '#7B97C4',
    accentDeep:      '#3F51B5',
    accentDim:       '#E1E8F5',
    accentGradient:  ['#E0EAFC', '#CFDEF3'] as const,

    // Oracle Fluid Aura
    orbRing3: 'rgba(123, 151, 196, 0.10)',
    orbRing2: 'rgba(123, 151, 196, 0.22)',
    orbRing1: 'rgba(123, 151, 196, 0.40)',
    orbBg3:   'rgba(123, 151, 196, 0.04)',
    orbBg2:   'rgba(123, 151, 196, 0.07)',
    orbBg1:   'rgba(123, 151, 196, 0.10)',

    // Ambient
    glowColor:    '#7B97C4',
    glowOpacity:  0.22,
    divider:      '#D1D1D6',
    statusBg:     '#EEF4EE',
    statusBorder: '#C4D8C4',
    statusDot:    '#34C759',
    statusText:   '#1E6221',
    manifestoBg:  ['rgba(230, 240, 255, 0.8)', 'rgba(242, 242, 247, 0)'] as const,
    blurTint:     'light' as const,
    blurIntensity: 60,
  },

  dark: {
    text:            '#F0F4FF',
    background:      '#0A0A0A', 
    tint:            tintColorDark,
    icon:            '#4A5A7A',
    tabIconDefault:  '#1C1C1E',
    tabIconSelected: tintColorDark,

    // Surfaces
    bgMid:           '#0D1117', 
    bgCard:          'rgba(30, 30, 35, 0.6)', 
    bgCardBorder:    'rgba(255, 255, 255, 0.1)',

    // Text scale
    textPrimary:     '#F0F4FF',
    textSecondary:   '#7A8A9A',
    textDim:         '#3A4A5A',
    textMuted:       '#222222',

    // Accent — Bioluminescent
    accentPrimary:   '#00F2FF',
    accentDeep:      '#007AFF',
    accentDim:       '#002B36',
    accentGradient:  ['#00F2FF', '#007AFF'] as const,

    // Oracle Fluid Aura
    orbRing3: 'rgba(0, 242, 255, 0.10)',
    orbRing2: 'rgba(0, 242, 255, 0.20)',
    orbRing1: 'rgba(0, 242, 255, 0.35)',
    orbBg3:   'rgba(0, 122, 255, 0.03)',
    orbBg2:   'rgba(0, 122, 255, 0.05)',
    orbBg1:   'rgba(0, 122, 255, 0.08)',

    // Ambient
    glowColor:    '#00F2FF',
    glowOpacity:  0.12,
    divider:      '#1C1C1E',
    statusBg:     '#0A1A0F',
    statusBorder: '#10301A',
    statusDot:    '#30D158',
    statusText:   '#30D158',
    manifestoBg:  ['rgba(0, 242, 255, 0.05)', 'rgba(10, 10, 10, 0)'] as const,
    blurTint:     'dark' as const,
    blurIntensity: 25,
  },
};

export type ColorSchemeTokens = typeof Colors.light & typeof Colors.dark;

/** Drop-in hook — returns the full token set for the current color scheme */
export function usePalette() {
  const context = useContext(ThemeContext);
  const mode = context?.colorMode || 'light'; 
  return Colors[mode];
}

// ── Typography ─────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});