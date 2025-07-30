<!-- 
  ATOM: Checkbox Component
  Custom styled checkbox with animations using Tailwind utilities
-->
<template>
  <label :class="checkboxContainerClasses">
    <input
      type="checkbox"
      class="absolute opacity-0 w-0 h-0"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @change="handleChange"
    />
    <span :class="checkboxClasses">
      <svg
        v-if="modelValue"
        class="w-3 h-3 sm:w-3.5 sm:h-3.5 theme-checkbox-icon animate-[checkmark-appear_0.2s_ease-in-out]"
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
    <span v-if="$slots.default" class="text-base theme-text-primary leading-6">
      <slot />
    </span>
  </label>
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

// Theme classes
const { getCheckboxClasses, getCheckboxContainerClasses } = useThemeClasses();

// Computed classes
const checkboxClasses = computed(() =>
  getCheckboxClasses(props.modelValue, props.disabled)
);

const checkboxContainerClasses = computed(() =>
  getCheckboxContainerClasses(props.disabled)
);

// Change handler
const handleChange = (event) => {
  if (!props.disabled) {
    emit("update:modelValue", event.target.checked);
  }
};
</script>

<style scoped>
/* Keyframe animation for checkmark */
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
</style>
