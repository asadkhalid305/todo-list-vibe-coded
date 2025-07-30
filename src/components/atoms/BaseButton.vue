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

<script setup lang="ts">
import { computed } from "vue";
import { useThemeClasses } from "@/composables/useThemeClasses";
import type { BaseButtonProps, BaseButtonEmits } from "@/types/components";

// Props definition with TypeScript
const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: "primary",
  size: "medium",
  disabled: false,
  type: "button",
});

// Emits definition with TypeScript
defineEmits<BaseButtonEmits>();

// Use theme classes composable
const { getButtonClasses } = useThemeClasses();

// Computed classes using the composable
const buttonClasses = computed(() => {
  return getButtonClasses(props.variant, props.size, props.disabled);
});
</script>
