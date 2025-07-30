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

<script setup lang="ts">
import { computed, ref } from "vue";
import type { BaseInputProps, BaseInputEmits } from "@/types/components";

// Props definition with TypeScript
const props = withDefaults(defineProps<BaseInputProps>(), {
  modelValue: "",
  type: "text",
  placeholder: "",
  disabled: false,
  error: "",
  size: "medium",
  ariaLabel: "",
  id: "",
});

// Emits definition with TypeScript
const emit = defineEmits<BaseInputEmits>();

// Template ref
const inputRef = ref<HTMLInputElement | null>(null);

// Input handler
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

// Computed classes using Tailwind utilities
const inputClasses = computed(() => {
  const baseClasses = [
    "w-full",
    "border",
    "rounded-md",
    "transition-all",
    "duration-150",
    "font-inherit",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-1",
    "placeholder:text-gray-500",
  ];

  // Size variants
  const sizeClasses = {
    small: ["px-3", "py-2", "text-sm", "min-h-8"],
    medium: ["px-4", "py-3", "text-base", "min-h-10"],
    large: ["px-5", "py-4", "text-lg", "min-h-12"],
  };

  // State classes
  const stateClasses: string[] = [];

  if (props.error) {
    stateClasses.push("theme-input-error", "focus:ring-red-500");
  } else {
    stateClasses.push("theme-input-normal", "focus:ring-purple-500");
  }

  if (props.disabled) {
    stateClasses.push("theme-input-disabled", "cursor-not-allowed");
  }

  return [...baseClasses, ...sizeClasses[props.size!], ...stateClasses];
});

// Expose methods
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>
