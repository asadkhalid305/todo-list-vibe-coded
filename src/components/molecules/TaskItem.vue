<!-- 
  MOLECULE: Task Item Component
  Individual task item with checkbox, text, and delete button
-->
<template>
  <div
    class="flex items-center gap-4 p-4 border rounded-lg shadow-sm transition-all duration-250 min-h-[60px] task-item hover:shadow-md sm:p-5 sm:gap-5 sm:p-6 md:gap-5 md:p-6"
    :class="{ 'task-item--completed': task.completed }"
  >
    <BaseCheckbox
      :model-value="task.completed"
      :aria-label="`Mark task '${task.text}' as ${
        task.completed ? 'incomplete' : 'complete'
      }`"
      @update:model-value="toggleComplete"
    />

    <span
      class="flex-1 text-base leading-relaxed break-words transition-all duration-150 task-item__text sm:text-sm md:text-lg"
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
        class="w-4 h-4 sm:w-3.5 sm:h-3.5"
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
/* Task item theme styles */
.task-item {
  background-color: var(--bg-secondary);
  border-color: var(--border-primary);
}

.task-item:hover {
  border-color: var(--border-secondary);
}

.task-item--completed {
  background-color: var(--bg-tertiary);
  border-color: var(--border-primary);
}

.task-item__text {
  color: var(--text-primary);
}

.task-item__text--completed {
  color: var(--text-secondary);
  text-decoration: line-through;
  text-decoration-color: var(--text-secondary);
}

/* Animation for task completion */
.task-item--completed .task-item__text {
  animation: task-complete 250ms ease-in-out;
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
