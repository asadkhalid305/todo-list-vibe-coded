<!-- 
  ATOM: Button Component
  Reusable button with different variants and sizes
-->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

// Props definition
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "danger", "success"].includes(value),
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
});

// Emits definition
defineEmits(["click"]);

// Computed classes based on props
const buttonClasses = computed(() => [
  "btn",
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    "btn--disabled": props.disabled,
  },
]);
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  white-space: nowrap;
}

/* Size variants */
.btn--small {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  min-height: 2rem;
}

.btn--medium {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  min-height: 2.5rem;
}

.btn--large {
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-lg);
  min-height: 3rem;
}

/* Color variants */
.btn--primary {
  background-color: var(--primary-color);
  color: var(--white);
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover:not(.btn--disabled) {
  background-color: var(--primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn--secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
  box-shadow: var(--shadow-sm);
}

.btn--secondary:hover:not(.btn--disabled) {
  background-color: var(--bg-tertiary);
  border-color: var(--border-primary);
  box-shadow: var(--shadow-md);
}

.btn--danger {
  background-color: var(--danger-color);
  color: var(--white);
  box-shadow: var(--shadow-sm);
}

.btn--danger:hover:not(.btn--disabled) {
  background-color: var(--danger-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn--success {
  background-color: var(--success-color);
  color: var(--white);
  box-shadow: var(--shadow-sm);
}

.btn--success:hover:not(.btn--disabled) {
  background-color: #059669;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Disabled state */
.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Mobile-first responsive adjustments */
@media (max-width: 639px) {
  .btn {
    min-height: 44px; /* Minimum tappable area for mobile */
  }

  .btn--small {
    min-height: 36px;
  }

  .btn--large {
    min-height: 48px;
  }
}
</style>
