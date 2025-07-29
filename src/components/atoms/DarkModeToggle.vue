<!-- 
  ATOM: Dark Mode Toggle Component
  Toggle switch with night and morning icons for dark/light mode
-->
<template>
  <button
    class="dark-mode-toggle"
    :class="{ 'dark-mode-toggle--dark': isDark }"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
  >
    <div class="dark-mode-toggle__track">
      <div
        class="dark-mode-toggle__thumb"
        :class="{ 'dark-mode-toggle__thumb--dark': isDark }"
      >
        <!-- Sun Icon (Light Mode) -->
        <svg
          v-if="!isDark"
          class="dark-mode-toggle__icon dark-mode-toggle__icon--sun"
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
          class="dark-mode-toggle__icon dark-mode-toggle__icon--moon"
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

// Methods
const toggleTheme = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<style scoped>
.dark-mode-toggle {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}

.dark-mode-toggle:hover {
  background-color: var(--bg-tertiary);
}

.dark-mode-toggle:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.dark-mode-toggle__track {
  position: relative;
  width: 3.5rem;
  height: 1.75rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: var(--radius-xl);
  transition: all var(--transition-normal);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-mode-toggle--dark .dark-mode-toggle__track {
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark-mode-toggle__thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateX(0);
}

.dark-mode-toggle__thumb--dark {
  transform: translateX(1.75rem);
  background: var(--bg-secondary);
}

.dark-mode-toggle__icon {
  width: 1rem;
  height: 1rem;
  transition: all var(--transition-fast);
}

.dark-mode-toggle__icon--sun {
  color: #f59e0b;
  animation: sun-rays 2s ease-in-out infinite alternate;
}

.dark-mode-toggle__icon--moon {
  color: #60a5fa;
  animation: moon-glow 3s ease-in-out infinite alternate;
}

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

/* Mobile optimizations */
@media (max-width: 639px) {
  .dark-mode-toggle {
    padding: var(--space-3);
  }

  .dark-mode-toggle__track {
    width: 3rem;
    height: 1.5rem;
  }

  .dark-mode-toggle__thumb {
    width: 1.25rem;
    height: 1.25rem;
  }

  .dark-mode-toggle__thumb--dark {
    transform: translateX(1.5rem);
  }

  .dark-mode-toggle__icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .dark-mode-toggle__track,
  .dark-mode-toggle__thumb,
  .dark-mode-toggle__icon {
    transition: none;
  }

  .dark-mode-toggle__icon--sun,
  .dark-mode-toggle__icon--moon {
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .dark-mode-toggle__track {
    border: 2px solid currentColor;
  }

  .dark-mode-toggle__thumb {
    border: 1px solid currentColor;
  }
}
</style>
