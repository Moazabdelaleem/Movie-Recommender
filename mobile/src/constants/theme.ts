/**
 * CUE Visual Identity Spec
 * Exact hex values & theme tokens
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  // Brand exact hex values
  primaryPink: '#FF5A7D',
  primaryPurple: '#7B61FF',
  surfaceDark: '#1E1E24',
  background: '#121217',
  textLight: '#F4F4F2',
  textMuted: '#8D8D96',

  // Gradient helper
  gradient: {
    start: '#FF5A7D',
    end: '#7B61FF',
  },

  // Light / Dark themes mapping to CUE tokens
  dark: {
    text: '#F4F4F2',
    background: '#121217',
    backgroundElement: '#1E1E24',
    backgroundSelected: '#2A2A33',
    textSecondary: '#8D8D96',
    primary: '#FF5A7D',
    primaryGradientStart: '#FF5A7D',
    primaryGradientEnd: '#7B61FF',
    cardBg: '#1E1E24',
    heartBtn: '#FF5A7D',
    rejectBtn: '#1E1E24',
  },
  light: {
    text: '#F4F4F2',
    background: '#121217',
    backgroundElement: '#1E1E24',
    backgroundSelected: '#2A2A33',
    textSecondary: '#8D8D96',
    primary: '#FF5A7D',
    primaryGradientStart: '#FF5A7D',
    primaryGradientEnd: '#7B61FF',
    cardBg: '#1E1E24',
    heartBtn: '#FF5A7D',
    rejectBtn: '#1E1E24',
  }
} as const;

export const Fonts = Platform.select({
  ios: {
    bold: 'Poppins-Bold',
    regular: 'Poppins-Regular',
    secondary: 'Inter-Regular',
    sans: 'system-ui',
  },
  default: {
    bold: 'sans-serif-medium',
    regular: 'sans-serif',
    secondary: 'sans-serif-light',
    sans: 'sans-serif',
  },
  web: {
    bold: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
    regular: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
    secondary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    sans: 'Poppins, sans-serif',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
