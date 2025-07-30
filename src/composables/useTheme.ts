/**
 * Theme Management Composable
 * Handles dark/light mode, system preferences, and theme persistence
 */

import { ref, watch, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import type { ThemeInfo } from "../types";

export function useTheme() {
  // Reactive state
  const isDarkMode: Ref<boolean> = ref(false);
  const systemPreference: Ref<boolean> = ref(false);
  const hasManualPreference: Ref<boolean> = ref(false);

  // Media query for system preference
  let mediaQuery: MediaQueryList | null = null;
  let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null;

  // Apply theme to DOM
  const applyTheme = (dark: boolean): void => {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  // Set theme manually (user preference)
  const setTheme = (dark: boolean): void => {
    isDarkMode.value = dark;
    hasManualPreference.value = true;
    applyTheme(dark);
  };

  // Toggle between light and dark
  const toggleTheme = (): void => {
    setTheme(!isDarkMode.value);
  };

  // Reset to system preference
  const useSystemPreference = (): void => {
    hasManualPreference.value = false;
    isDarkMode.value = systemPreference.value;
    applyTheme(systemPreference.value);
  };

  // Get current theme info
  const getThemeInfo = (): ThemeInfo => {
    return {
      isDark: isDarkMode.value,
      mode: hasManualPreference.value
        ? isDarkMode.value
          ? "dark"
          : "light"
        : "auto",
      systemPrefersDark: systemPreference.value,
    };
  };

  // Setup system preference detection
  const setupSystemPreferenceDetection = () => {
    if (typeof window === "undefined") return;

    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemPreference.value = mediaQuery.matches;

    mediaQueryHandler = (event) => {
      systemPreference.value = event.matches;

      // Auto-update theme if no manual preference is set
      if (!hasManualPreference.value) {
        isDarkMode.value = event.matches;
        applyTheme(event.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", mediaQueryHandler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(mediaQueryHandler);
    }

    // Set initial theme based on system preference
    if (!hasManualPreference.value) {
      isDarkMode.value = systemPreference.value;
      applyTheme(systemPreference.value);
    }
  };

  // Cleanup system preference detection
  const cleanupSystemPreferenceDetection = () => {
    if (mediaQuery && mediaQueryHandler) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", mediaQueryHandler);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(mediaQueryHandler);
      }
    }
  };

  // Initialize theme from saved data
  const initializeFromData = (savedData: any): void => {
    if (savedData && typeof savedData.isDarkMode === "boolean") {
      isDarkMode.value = savedData.isDarkMode;
      hasManualPreference.value = true;
      applyTheme(savedData.isDarkMode);
    } else {
      // No saved preference, use system preference
      useSystemPreference();
    }
  };

  // Get theme data for saving
  const getThemeData = () => {
    return {
      isDarkMode: isDarkMode.value,
      hasManualPreference: hasManualPreference.value,
    };
  };

  // CSS custom properties helpers
  const getCSSVariable = (variable: string): string | null => {
    if (typeof window === "undefined") return null;
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  };

  const setCSSVariable = (variable: string, value: string): void => {
    if (typeof window === "undefined") return;
    document.documentElement.style.setProperty(variable, value);
  };

  // Theme color utilities
  const getThemeColors = (): Record<string, string | null> => {
    const colors: Record<string, string | null> = {};
    const colorVariables = [
      "--bg-primary",
      "--bg-secondary",
      "--bg-tertiary",
      "--text-primary",
      "--text-secondary",
      "--text-muted",
      "--border-primary",
      "--border-secondary",
      "--purple-600",
      "--purple-700",
    ];

    colorVariables.forEach((variable) => {
      colors[variable.replace("--", "")] = getCSSVariable(variable);
    });

    return colors;
  };

  // Animation preferences
  const respectsReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const respectsHighContrast = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-contrast: high)").matches;
  };

  // Accessibility helpers
  const getAccessibilityInfo = () => {
    return {
      reducedMotion: respectsReducedMotion(),
      highContrast: respectsHighContrast(),
      theme: getThemeInfo(),
    };
  };

  // Setup lifecycle
  onMounted(() => {
    setupSystemPreferenceDetection();
  });

  onUnmounted(() => {
    cleanupSystemPreferenceDetection();
  });

  return {
    // State
    isDarkMode,
    systemPreference,
    hasManualPreference,

    // Methods
    setTheme,
    toggleTheme,
    useSystemPreference,
    applyTheme,

    // Data management
    initializeFromData,
    getThemeData,
    getThemeInfo,

    // CSS utilities
    getCSSVariable,
    setCSSVariable,
    getThemeColors,

    // Accessibility
    respectsReducedMotion,
    respectsHighContrast,
    getAccessibilityInfo,

    // Lifecycle
    setupSystemPreferenceDetection,
    cleanupSystemPreferenceDetection,
  };
}
