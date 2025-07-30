/**
 * Composable for animations and transitions
 * Provides reusable animation utilities and motion preferences
 */

import { ref, computed, onMounted, nextTick, readonly } from "vue";

export const useAnimations = () => {
  const prefersReducedMotion = ref(false);
  const animationsEnabled = ref(true);

  // Check user's motion preferences
  const checkMotionPreferences = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotion.value = mediaQuery.matches;

      // Listen for changes
      mediaQuery.addEventListener("change", (e) => {
        prefersReducedMotion.value = e.matches;
      });
    }
  };

  // Animation configurations
  const animationConfigs = {
    // List animations
    listEnter: {
      duration: "0.3s",
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      delay: "0ms",
    },

    listLeave: {
      duration: "0.2s",
      easing: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
      delay: "0ms",
    },

    // Stagger animations for lists
    staggerEnter: {
      duration: "0.4s",
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      baseDelay: 50, // ms between items
      maxDelay: 300, // max delay to prevent too long waits
    },

    // Card/component animations
    cardHover: {
      duration: "0.15s",
      easing: "ease-out",
    },

    // Form animations
    formSubmit: {
      duration: "0.3s",
      easing: "ease-out",
    },

    // Theme transition
    themeTransition: {
      duration: "0.2s",
      easing: "ease-in-out",
    },

    // Progress bar
    progressFill: {
      duration: "0.7s",
      easing: "ease-out",
    },

    // Message animations
    messageAppear: {
      duration: "0.3s",
      easing: "ease-out",
    },
  };

  // Get animation styles based on preferences
  const getAnimationStyle = (
    configKey: keyof typeof animationConfigs,
    customConfig: Record<string, any> = {}
  ) => {
    const config = { ...animationConfigs[configKey], ...customConfig };

    if (prefersReducedMotion.value || !animationsEnabled.value) {
      return {
        transition: "none",
        animation: "none",
      };
    }

    return {
      transitionDuration: config.duration,
      transitionTimingFunction: config.easing,
      transitionDelay: (config as any).delay || "0ms",
    };
  };

  // List animation utilities
  const createListTransition = (name = "list") => {
    return {
      name,
      css: false, // We'll use CSS classes instead

      onEnter: (el: HTMLElement, done: () => void) => {
        if (prefersReducedMotion.value || !animationsEnabled.value) {
          done();
          return;
        }

        // Set initial state
        el.style.opacity = "0";
        el.style.transform = "translateY(20px) scale(0.9)";

        requestAnimationFrame(() => {
          el.style.transition = `all ${animationConfigs.listEnter.duration} ${animationConfigs.listEnter.easing}`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";

          const handleTransitionEnd = () => {
            el.removeEventListener("transitionend", handleTransitionEnd);
            el.style.transition = "";
            done();
          };

          el.addEventListener("transitionend", handleTransitionEnd);
        });
      },

      onLeave: (el: HTMLElement, done: () => void) => {
        if (prefersReducedMotion.value) {
          done();
          return;
        }

        el.style.transition = `all ${animationConfigs.listLeave.duration} ${animationConfigs.listLeave.easing}`;
        el.style.opacity = "0";
        el.style.transform = "translateY(-10px) scale(0.9)";

        setTimeout(
          done,
          parseFloat(animationConfigs.listLeave.duration) * 1000
        );
      },
    };
  };

  // Stagger animation for list items
  const getStaggerDelay = (index: number, maxItems = 10): string => {
    if (prefersReducedMotion.value || !animationsEnabled.value) return "0ms";

    const { baseDelay, maxDelay } = animationConfigs.staggerEnter;
    const delay = Math.min(index * baseDelay, maxDelay);

    return `${delay}ms`;
  };

  // Animation class helpers
  const getAnimationClasses = (type: string, isActive = false): string[] => {
    const baseClasses: string[] = [];

    if (prefersReducedMotion.value || !animationsEnabled.value) {
      return baseClasses;
    }

    switch (type) {
      case "list-item":
        baseClasses.push("transition-all", "duration-300", "ease-out");
        break;

      case "card":
        baseClasses.push("transition-all", "duration-150", "ease-out");
        if (isActive) baseClasses.push("hover:shadow-md", "hover:scale-105");
        break;

      case "button":
        baseClasses.push("transition-all", "duration-150", "ease-out");
        if (isActive) baseClasses.push("hover:scale-105", "active:scale-95");
        break;

      case "form":
        baseClasses.push("transition-all", "duration-200", "ease-out");
        break;

      case "progress":
        baseClasses.push("transition-all", "duration-700", "ease-out");
        break;

      case "theme":
        baseClasses.push("transition-colors", "duration-200", "ease-in-out");
        break;
    }

    return baseClasses;
  };

  // CSS custom properties for animations
  const getAnimationVariables = () => {
    if (prefersReducedMotion.value || !animationsEnabled.value) {
      return {
        "--animation-duration-fast": "0s",
        "--animation-duration-normal": "0s",
        "--animation-duration-slow": "0s",
        "--animation-easing": "linear",
      };
    }

    return {
      "--animation-duration-fast": "0.15s",
      "--animation-duration-normal": "0.3s",
      "--animation-duration-slow": "0.7s",
      "--animation-easing": "cubic-bezier(0.25, 0.8, 0.25, 1)",
      "--animation-easing-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    };
  };

  // Programmatic animations
  // Animation configuration with proper typing
  interface AnimationOptions {
    duration?: number;
    easing?: string;
    delay?: number;
    fill?: FillMode;
  }

  const animateElement = async (
    element: HTMLElement,
    animation: Keyframe[],
    options: AnimationOptions = {}
  ): Promise<void> => {
    if (!element || prefersReducedMotion.value || !animationsEnabled.value) {
      return Promise.resolve();
    }

    const {
      duration = 300,
      easing = "ease-out",
      delay = 0,
      fill = "forwards",
    } = options;

    return new Promise((resolve) => {
      const keyframes = Array.isArray(animation) ? animation : [animation];

      const animationOptions = {
        duration,
        easing,
        delay,
        fill,
      };

      const animationInstance = element.animate(keyframes, animationOptions);

      animationInstance.addEventListener("finish", () => resolve());
      animationInstance.addEventListener("cancel", () => resolve());
    });
  };

  // Common animation presets
  const animations = {
    fadeIn: [{ opacity: 0 }, { opacity: 1 }],

    fadeOut: [{ opacity: 1 }, { opacity: 0 }],

    slideInUp: [
      { transform: "translateY(20px)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],

    slideOutDown: [
      { transform: "translateY(0)", opacity: 1 },
      { transform: "translateY(20px)", opacity: 0 },
    ],

    scaleIn: [
      { transform: "scale(0.9)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 },
    ],

    scaleOut: [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(0.9)", opacity: 0 },
    ],

    bounce: [
      { transform: "translateY(0)" },
      { transform: "translateY(-10px)" },
      { transform: "translateY(0)" },
    ],

    shake: [
      { transform: "translateX(0)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0)" },
    ],
  };

  // Quick animation helpers
  const fadeIn = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.fadeIn, options);
  const fadeOut = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.fadeOut, options);
  const slideInUp = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.slideInUp, options);
  const slideOutDown = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.slideOutDown, options);
  const scaleIn = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.scaleIn, options);
  const scaleOut = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.scaleOut, options);
  const bounce = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.bounce, { duration: 600, ...options });
  const shake = (element: HTMLElement, options?: AnimationOptions) =>
    animateElement(element, animations.shake, { duration: 400, ...options });

  // Setup
  onMounted(() => {
    checkMotionPreferences();

    // Apply animation variables to document
    const root = document.documentElement;
    const variables = getAnimationVariables();

    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  });

  return {
    // State
    prefersReducedMotion: readonly(prefersReducedMotion),
    animationsEnabled,

    // Configuration
    animationConfigs,

    // Utilities
    getAnimationStyle,
    getAnimationClasses,
    getAnimationVariables,
    getStaggerDelay,
    createListTransition,

    // Animation methods
    animateElement,
    fadeIn,
    fadeOut,
    slideInUp,
    slideOutDown,
    scaleIn,
    scaleOut,
    bounce,
    shake,

    // Presets
    animations,
  };
};

// Specialized hook for list animations
export const useListAnimations = () => {
  const {
    createListTransition,
    getStaggerDelay,
    getAnimationClasses,
    prefersReducedMotion,
  } = useAnimations();

  const listTransition = computed(() => createListTransition("task-list"));

  const getItemAnimationStyle = (index: number) => {
    return {
      animationDelay: getStaggerDelay(index),
      ...(!prefersReducedMotion.value && {
        animation: "slide-in-up 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards",
      }),
    };
  };

  const getItemClasses = (index: number) => {
    const classes = getAnimationClasses("list-item");

    if (!prefersReducedMotion.value) {
      classes.push(
        "animate-[slide-in-up_0.4s_cubic-bezier(0.25,0.8,0.25,1)_forwards]"
      );
    }

    return classes;
  };

  return {
    listTransition,
    getItemAnimationStyle,
    getItemClasses,
    getStaggerDelay,
  };
};

// Hook for form animations
export const useFormAnimations = () => {
  const { getAnimationClasses, animateElement, shake, bounce } =
    useAnimations();

  const getFormClasses = () => getAnimationClasses("form");
  const getButtonClasses = () => getAnimationClasses("button", true);

  const animateError = (element: HTMLElement) =>
    shake(element, { duration: 400 });
  const animateSuccess = (element: HTMLElement) =>
    bounce(element, { duration: 600 });

  return {
    getFormClasses,
    getButtonClasses,
    animateError,
    animateSuccess,
    animateElement,
  };
};
