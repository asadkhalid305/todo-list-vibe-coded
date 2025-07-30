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
import { useThemeClasses } from "@/composables/useThemeClasses";

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

// Use theme classes composable
const { getButtonClasses } = useThemeClasses();

// Computed classes using the composable
const buttonClasses = computed(() => {
  return getButtonClasses(props.variant, props.size, props.disabled);
});
</script>
