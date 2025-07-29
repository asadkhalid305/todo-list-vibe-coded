<!-- 
  MOLECULE: Task Item Component
  Individual task item with checkbox, text, and delete button
-->
<template>
  <div class="task-item" :class="{ 'task-item--completed': task.completed }">
    <BaseCheckbox
      :model-value="task.completed"
      :aria-label="`Mark task '${task.text}' as ${
        task.completed ? 'incomplete' : 'complete'
      }`"
      @update:model-value="toggleComplete"
    />

    <span
      class="task-item__text"
      :class="{ 'task-item__text--completed': task.completed }"
    >
      {{ task.text }}
    </span>

    <BaseButton
      variant="danger"
      size="small"
      :aria-label="`Delete task '${task.text}'`"
      @click="deleteTask"
    >
      <svg
        class="task-item__delete-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </BaseButton>
  </div>
</template>

<script setup>
import BaseCheckbox from "../atoms/BaseCheckbox.vue";
import BaseButton from "../atoms/BaseButton.vue";

// Props definition
const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator: (task) => {
      return (
        task &&
        typeof task.id !== "undefined" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
      );
    },
  },
});

// Emits definition
const emit = defineEmits(["toggle-complete", "delete"]);

// Event handlers
const toggleComplete = () => {
  emit("toggle-complete", props.task.id);
};

const deleteTask = () => {
  emit("delete", props.task.id);
};
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  min-height: 60px;
}

.task-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-secondary);
}

.task-item--completed {
  background-color: var(--bg-tertiary);
  border-color: var(--border-primary);
}

.task-item__text {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  line-height: 1.5;
  word-break: break-word;
  transition: all var(--transition-fast);
}

.task-item__text--completed {
  color: var(--text-secondary);
  text-decoration: line-through;
  text-decoration-color: var(--text-secondary);
}

.task-item__delete-icon {
  width: 1rem;
  height: 1rem;
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .task-item {
    padding: var(--space-4) var(--space-3);
    gap: var(--space-3);
    min-height: 56px;
  }

  .task-item__text {
    font-size: var(--font-size-sm);
  }

  .task-item__delete-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .task-item {
    padding: var(--space-5) var(--space-6);
    gap: var(--space-5);
  }

  .task-item__text {
    font-size: var(--font-size-lg);
  }
}

/* Animation for task completion */
.task-item--completed .task-item__text {
  animation: task-complete var(--transition-normal) ease-in-out;
}

@keyframes task-complete {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .task-item,
  .task-item__text {
    transition: none;
  }

  .task-item--completed .task-item__text {
    animation: none;
  }
}
</style>
