/**
 * Theme Management Composable
 * Handles dark/light mode, system preferences, and theme persistence
 */

import { ref, watch, onMounted, onUnmounted } from "vue";

export function useTheme() {
  // Reactive state
  const isDarkMode = ref(false);
  const systemPreference = ref(false);
  const hasManualPreference = ref(false);

  // Media query for system preference
  let mediaQuery = null;
  let mediaQueryHandler = null;

  // Apply theme to DOM
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  // Set theme manually (user preference)
  const setTheme = (dark) => {
    isDarkMode.value = dark;
    hasManualPreference.value = true;
    applyTheme(dark);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(!isDarkMode.value);
  };

  // Reset to system preference
  const useSystemPreference = () => {
    hasManualPreference.value = false;
    isDarkMode.value = systemPreference.value;
    applyTheme(systemPreference.value);
  };

  // Get current theme info
  const getThemeInfo = () => {
    return {
      current: isDarkMode.value ? "dark" : "light",
      isSystemPreference: !hasManualPreference.value,
      systemPreference: systemPreference.value ? "dark" : "light",
      hasManualPreference: hasManualPreference.value,
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
  const initializeFromData = (savedData) => {
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
  const getCSSVariable = (variable) => {
    if (typeof window === "undefined") return null;
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  };

  const setCSSVariable = (variable, value) => {
    if (typeof window === "undefined") return;
    document.documentElement.style.setProperty(variable, value);
  };

  // Theme color utilities
  const getThemeColors = () => {
    const colors = {};
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
  const respectsReducedMotion = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const respectsHighContrast = () => {
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
