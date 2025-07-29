<!-- 
  ATOM: Input Component
  Reusable input field with validation states
-->
<template>
  <input
    ref="inputRef"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    :class="inputClasses"
    :aria-label="ariaLabel"
    :aria-describedby="error ? `${id}-error` : undefined"
    @input="handleInput"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    @keydown="$emit('keydown', $event)"
  />
</template>

<script setup>
import { computed, ref } from "vue";

// Props definition
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  ariaLabel: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
});

// Emits definition
const emit = defineEmits(["update:modelValue", "blur", "focus", "keydown"]);

// Template ref
const inputRef = ref(null);

// Input handler
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

// Computed classes
const inputClasses = computed(() => [
  "input",
  `input--${props.size}`,
  {
    "input--error": props.error,
    "input--disabled": props.disabled,
  },
]);

// Expose methods
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all var(--transition-fast);
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--text-secondary);
}

/* Size variants */
.input--small {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  min-height: 2rem;
}

.input--medium {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  min-height: 2.5rem;
}

.input--large {
  padding: var(--space-4) var(--space-5);
  font-size: var(--font-size-lg);
  min-height: 3rem;
}

/* Error state */
.input--error {
  border-color: var(--danger-color);
}

.input--error:focus {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Disabled state */
.input--disabled {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.input--disabled::placeholder {
  color: var(--text-secondary);
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .input {
    min-height: 44px; /* Minimum tappable area */
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .input--small {
    min-height: 40px;
  }

  .input--large {
    min-height: 48px;
  }
}
</style>
