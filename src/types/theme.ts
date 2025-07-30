/**
 * Theme and UI Types
 */

export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeInfo {
  isDark: boolean;
  mode: ThemeMode;
  systemPrefersDark: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colors: ThemeColors;
  animations: boolean;
  reducedMotion: boolean;
}

export type ThemeVariableName =
  | "--color-primary"
  | "--color-secondary"
  | "--color-accent"
  | "--color-bg-primary"
  | "--color-bg-secondary"
  | "--color-text-primary"
  | "--color-text-secondary"
  | "--color-border";

export type ComponentSize = "small" | "medium" | "large";
export type ComponentVariant = "primary" | "secondary" | "muted";
