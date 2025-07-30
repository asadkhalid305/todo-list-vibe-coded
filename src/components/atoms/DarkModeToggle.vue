<!-- 
  ATOM: Dark Mode Toggle Component
  Toggle switch with night and morning icons for dark/light mode using Tailwind utilities
-->
<template>
  <button
    :class="toggleClasses.button"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
  >
    <div :class="toggleClasses.track">
      <div :class="toggleClasses.thumb">
        <!-- Sun Icon (Light Mode) -->
        <svg
          v-if="!isDark"
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 theme-toggle-sun animate-[sun-rays_2s_ease-in-out_infinite_alternate] transition-all duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          />
        </svg>

        <!-- Moon Icon (Dark Mode) -->
        <svg
          v-else
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 theme-toggle-moon animate-[moon-glow_3s_ease-in-out_infinite_alternate] transition-all duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </div>

    <!-- Label text for accessibility (visually hidden) -->
    <span class="sr-only">
      {{ isDark ? "Dark mode" : "Light mode" }}
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useThemeClasses } from "@/composables/useThemeClasses";

// Props definition
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// Emits definition
const emit = defineEmits(["update:modelValue"]);

// Computed properties
const isDark = computed(() => props.modelValue);

// Theme classes
const { getToggleClasses } = useThemeClasses();

// Computed classes
const toggleClasses = computed(() => getToggleClasses(isDark.value));

// Methods
const toggleTheme = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<style scoped>
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Animations */
@keyframes sun-rays {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(45deg) scale(1.05);
  }
}

@keyframes moon-glow {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .duration-200,
  .duration-300,
  .transition-all {
    transition: none;
  }

  .animate-\[sun-rays_2s_ease-in-out_infinite_alternate\],
  .animate-\[moon-glow_3s_ease-in-out_infinite_alternate\] {
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .theme-toggle-track {
    border: 2px solid currentColor;
  }

  .theme-toggle-thumb {
    border: 1px solid currentColor;
  }
}
</style>
