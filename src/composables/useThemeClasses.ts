/**
 * Composable for theme-aware Tailwind classes
 * This provides a bridge between Tailwind utilities and our CSS custom properties
 */

interface SizeClasses {
  small: string[];
  medium: string[];
  large: string[];
  [key: string]: string[];
}

interface SpacingClasses {
  xs: string[];
  sm: string[];
  md: string[];
  lg: string[];
  xl: string[];
}

interface ThemeClassesType {
  card: string[];
  cardHover: string[];
  buttonBase: string[];
  inputBase: string[];
  textPrimary: string[];
  textSecondary: string[];
  textMuted: string[];
  bgPrimary: string[];
  bgSecondary: string[];
  bgTertiary: string[];
  spacing: SpacingClasses;
  sizes: {
    button: SizeClasses;
    input: SizeClasses;
  };
}

export const useThemeClasses = () => {
  // Base component classes that work with our theme variables
  const themeClasses: ThemeClassesType = {
    // Card/Container styles
    card: [
      "rounded-lg",
      "border",
      "shadow-sm",
      "transition-all",
      "duration-250",
      "theme-card", // Custom class for theme colors
    ],

    cardHover: ["hover:shadow-md", "hover:border-opacity-75"],

    // Button base classes (to be combined with variant classes)
    buttonBase: [
      "inline-flex",
      "items-center",
      "justify-center",
      "font-medium",
      "rounded-md",
      "transition-all",
      "duration-150",
      "cursor-pointer",
      "select-none",
      "no-underline",
      "whitespace-nowrap",
      "border",
      "shadow-sm",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2",
    ],

    // Input base classes
    inputBase: [
      "w-full",
      "border",
      "rounded-md",
      "transition-all",
      "duration-150",
      "font-inherit",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-1",
    ],

    // Text styles that work with theme
    textPrimary: ["theme-text-primary"],
    textSecondary: ["theme-text-secondary"],
    textMuted: ["theme-text-muted"],

    // Background styles
    bgPrimary: ["theme-bg-primary"],
    bgSecondary: ["theme-bg-secondary"],
    bgTertiary: ["theme-bg-tertiary"],

    // Spacing (using Tailwind's spacing scale)
    spacing: {
      xs: ["gap-2", "p-2"],
      sm: ["gap-3", "p-3"],
      md: ["gap-4", "p-4"],
      lg: ["gap-5", "p-5"],
      xl: ["gap-6", "p-6"],
    },

    // Responsive sizes
    sizes: {
      button: {
        small: ["px-3", "py-2", "text-sm", "min-h-8"],
        medium: ["px-4", "py-3", "text-base", "min-h-10"],
        large: ["px-6", "py-4", "text-lg", "min-h-12"],
      },
      input: {
        small: ["px-3", "py-2", "text-sm", "min-h-8"],
        medium: ["px-4", "py-3", "text-base", "min-h-10"],
        large: ["px-5", "py-4", "text-lg", "min-h-12"],
      },
    },
  };

  // Utility function to combine classes
  const combineClasses = (...classArrays: (string | string[])[]): string => {
    return classArrays.flat().filter(Boolean).join(" ");
  };

  // Specific component class builders
  const getCardClasses = (variant = "default", hover = true) => {
    const classes = [...themeClasses.card];
    if (hover) classes.push(...themeClasses.cardHover);
    return combineClasses(classes);
  };

  const getButtonClasses = (
    variant = "primary",
    size = "medium",
    disabled = false
  ) => {
    const classes = [
      ...themeClasses.buttonBase,
      ...themeClasses.sizes.button[size],
      `theme-btn-${variant}`,
    ];

    if (disabled) {
      classes.push(
        "opacity-60",
        "cursor-not-allowed",
        "!transform-none",
        "!shadow-none"
      );
    }

    return combineClasses(classes);
  };

  const getInputClasses = (
    size = "medium",
    error = false,
    disabled = false
  ): string => {
    const classes = [
      ...themeClasses.inputBase,
      ...themeClasses.sizes.input[size],
      error ? "theme-input-error" : "theme-input-normal",
    ];

    if (disabled) {
      classes.push("theme-input-disabled", "cursor-not-allowed");
    }

    return combineClasses(classes);
  };

  const getTextClasses = (variant = "primary", size = "base"): string => {
    const textKey = `text${
      variant.charAt(0).toUpperCase() + variant.slice(1)
    }` as keyof ThemeClassesType;
    return combineClasses(
      (themeClasses as any)[textKey] || themeClasses.textPrimary,
      `text-${size}`
    );
  };

  const getCheckboxClasses = (checked = false, disabled = false): string => {
    const classes = [
      "relative",
      "w-5",
      "h-5",
      "border-2",
      "rounded",
      "flex",
      "items-center",
      "justify-center",
      "flex-shrink-0",
      "transition-all",
      "duration-200",
      "theme-checkbox",
    ];

    if (checked) {
      classes.push("theme-checkbox-checked");
    }

    if (disabled) {
      classes.push("opacity-60", "cursor-not-allowed");
    } else {
      classes.push("cursor-pointer");
    }

    return combineClasses(classes);
  };

  const getCheckboxContainerClasses = (disabled = false): string => {
    const classes = ["inline-flex", "items-center", "gap-3", "select-none"];

    if (disabled) {
      classes.push("cursor-not-allowed", "opacity-60");
    } else {
      classes.push("cursor-pointer");
    }

    return combineClasses(classes);
  };

  const getToggleClasses = (isDark = false): Record<string, string> => {
    const buttonClasses = [
      "relative",
      "p-2",
      "border-none",
      "cursor-pointer",
      "rounded-2xl",
      "transition-all",
      "duration-200",
      "theme-toggle-button",
      "focus:outline-none",
      "focus:outline-2",
      "focus:outline-offset-2",
    ];

    const trackClasses = [
      "relative",
      "w-14",
      "h-7",
      "rounded-2xl",
      "transition-all",
      "duration-300",
      "shadow-inner",
      isDark ? "theme-toggle-track-dark" : "theme-toggle-track",
    ];

    const thumbClasses = [
      "absolute",
      "top-0.5",
      "left-0.5",
      "w-6",
      "h-6",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      "transition-all",
      "duration-300",
      "shadow-md",
      "transform",
      isDark
        ? "translate-x-7 theme-toggle-thumb-dark"
        : "translate-x-0 theme-toggle-thumb",
    ];

    return {
      button: combineClasses(buttonClasses),
      track: combineClasses(trackClasses),
      thumb: combineClasses(thumbClasses),
    };
  };

  return {
    themeClasses,
    combineClasses,
    getCardClasses,
    getButtonClasses,
    getInputClasses,
    getTextClasses,
    getCheckboxClasses,
    getCheckboxContainerClasses,
    getToggleClasses,
  };
};
