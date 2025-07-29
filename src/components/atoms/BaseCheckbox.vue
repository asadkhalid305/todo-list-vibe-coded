<!-- 
  ATOM: Checkbox Component
  Custom styled checkbox with animations
-->
<template>
  <label class="checkbox" :class="{ 'checkbox--disabled': disabled }">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @change="handleChange"
    />
    <span
      class="checkbox__checkmark"
      :class="{ 'checkbox__checkmark--checked': modelValue }"
    >
      <svg
        v-if="modelValue"
        class="checkbox__icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
    <span v-if="$slots.default" class="checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup>
// Props definition
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: "",
  },
});

// Emits definition
const emit = defineEmits(["update:modelValue"]);

// Change handler
const handleChange = (event) => {
  if (!props.disabled) {
    emit("update:modelValue", event.target.checked);
  }
};
</script>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: var(--space-3);
}

.checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__checkmark {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-secondary);
  border-radius: var(--radius-sm);
  background-color: var(--bg-secondary);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkbox__checkmark--checked {
  background-color: var(--purple-600);
  border-color: var(--purple-600);
}

.checkbox__icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--purple-50);
  animation: checkmark-appear var(--transition-fast) ease-in-out;
}

.checkbox__label {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  line-height: 1.5;
}

/* Hover states */
.checkbox:hover:not(.checkbox--disabled) .checkbox__checkmark {
  border-color: var(--purple-500);
  box-shadow: 0 0 0 3px var(--purple-100);
}

/* Focus states */
.checkbox__input:focus + .checkbox__checkmark {
  box-shadow: 0 0 0 3px var(--purple-200);
}

/* Animations */
@keyframes checkmark-appear {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .checkbox__checkmark {
    width: 1.5rem;
    height: 1.5rem;
  }

  .checkbox__icon {
    width: 1rem;
    height: 1rem;
  }

  .checkbox {
    gap: var(--space-4);
  }
}
</style>
