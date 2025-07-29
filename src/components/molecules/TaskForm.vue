<!-- 
  MOLECULE: Task Form Component
  Form for adding new tasks with input and submit button
-->
<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <div class="task-form__input-group">
      <BaseInput
        ref="inputRef"
        v-model="newTaskText"
        type="text"
        placeholder="Add a new task..."
        size="large"
        :aria-label="'New task input'"
        :error="error"
        @keydown="handleKeydown"
      />
      <BaseButton
        type="submit"
        variant="primary"
        size="large"
        :disabled="!newTaskText.trim() || isSubmitting"
        :aria-label="'Add new task'"
      >
        <svg
          v-if="!isSubmitting"
          class="task-form__add-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span v-else class="task-form__spinner">
          <svg class="task-form__spinner-icon" viewBox="0 0 24 24">
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
        <span class="task-form__button-text">
          {{ isSubmitting ? "Adding..." : "Add" }}
        </span>
      </BaseButton>
    </div>
    <div v-if="error" class="task-form__error" role="alert">
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
.task-form {
  width: 100%;
}

.task-form__input-group {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.task-form__input-group > :first-child {
  flex: 1;
}

.task-form__add-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.task-form__spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.task-form__spinner-icon {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
}

.task-form__button-text {
  margin-left: var(--space-2);
}

.task-form__error {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: var(--danger-color);
  font-size: var(--font-size-sm);
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .task-form__input-group {
    gap: var(--space-2);
  }

  .task-form__add-icon {
    width: 1rem;
    height: 1rem;
  }

  .task-form__spinner-icon {
    width: 1rem;
    height: 1rem;
  }

  .task-form__button-text {
    display: none; /* Hide text on mobile, show only icon */
  }
}

/* Tablet and desktop */
@media (min-width: 640px) {
  .task-form__input-group {
    gap: var(--space-4);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .task-form__spinner-icon {
    animation: none;
  }
}
</style>
