<!-- 
  MOLECULE: Task Form Component
  Form for adding new tasks with input and submit button using Tailwind utilities
-->
<template>
  <form class="w-full" @submit.prevent="handleSubmit">
    <div class="flex gap-3 items-center sm:gap-4">
      <BaseInput
        ref="inputRef"
        v-model="newTaskText"
        type="text"
        placeholder="Add a new task..."
        size="large"
        :aria-label="'New task input'"
        :error="error"
        class="flex-1"
        @keydown="handleKeydown"
      />
      <BaseButton
        type="submit"
        variant="primary"
        size="large"
        :disabled="!newTaskText.trim() || isSubmitting"
        :aria-label="'Add new task'"
        class="!px-3 !py-3 !w-12 !h-12 !min-h-12 flex items-center justify-center"
      >
        <svg
          v-if="!isSubmitting"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span v-else class="inline-flex items-center justify-center">
          <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
              opacity="0.25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      </BaseButton>
    </div>
    <div
      v-if="error"
      class="mt-2 p-2 px-3 rounded-md border text-sm theme-error"
      role="alert"
    >
      {{ error }}
    </div>
  </form>
</template>

<script setup>
import { ref, nextTick } from "vue";
import BaseInput from "../atoms/BaseInput.vue";
import BaseButton from "../atoms/BaseButton.vue";

// Props definition
const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

// Emits definition
const emit = defineEmits(["add-task"]);

// Reactive data
const newTaskText = ref("");
const error = ref("");
const inputRef = ref(null);

// Methods
const handleSubmit = async () => {
  const trimmedText = newTaskText.value.trim();

  if (!trimmedText) {
    error.value = "Task cannot be empty";
    await nextTick();
    inputRef.value?.focus();
    return;
  }

  if (trimmedText.length > 200) {
    error.value = "Task cannot exceed 200 characters";
    return;
  }

  error.value = "";
  emit("add-task", trimmedText);
  newTaskText.value = "";

  // Focus back to input after adding
  await nextTick();
  inputRef.value?.focus();
};

const handleKeydown = (event) => {
  // Clear error when user starts typing
  if (error.value) {
    error.value = "";
  }

  // Handle Enter key
  if (event.key === "Enter") {
    event.preventDefault();
    handleSubmit();
  }
};

// Expose methods for parent component
defineExpose({
  focus: () => inputRef.value?.focus(),
  clear: () => {
    newTaskText.value = "";
    error.value = "";
  },
});
</script>

<style scoped>
/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none;
  }
}
</style>
