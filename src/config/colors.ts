// Color and typography configuration for CineMatch

/**
 * Color palette for CineMatch app
 * Main colors used throughout the application
 */
export const COLORS = {
  // Main backgrounds
  background: '#050403ff',
  surface: '#1A1412',

  // Primary brand colors
  primary: '#C7A24C',
  accent: '#A4252C',

  // Text
  text: '#F2E9E4',
  textSecondary: '#8E8E93',

  // Status colors
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Utility
  border: '#1A1412',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof COLORS;

/**
 * Typography configuration for CineMatch app
 * Simplified for Android development
 */
export const FONTS = {
  // Elegant fonts for headings and branding
  heading: {
    serif: 'serif',        // Elegant serif font for titles/logos
    serifBold: 'serif',    // Bold serif for important headings
  },
  
  // Clean fonts for body text and UI
  body: {
    sansSerif: 'sans-serif',       // Clean font for body text
    sansSerifMedium: 'sans-serif-medium', // Medium weight
    roboto: 'Roboto',              // Default Android font
    robotoBold: 'Roboto-Bold',     // Bold Roboto
  },
} as const;

export type FontName = keyof typeof FONTS.heading | keyof typeof FONTS.body;

