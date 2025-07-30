<!-- 
  ORGANISM: Task List Component
  Container for displaying filtered list of tasks with animations using Tailwind utilities
-->
<template>
  <div class="w-full">
    <!-- Empty state -->
    <div
      v-if="filteredTasks.length === 0"
      class="flex flex-col items-center justify-center text-center px-6 py-12 sm:px-4 sm:py-8 md:px-8 md:py-16 text-gray-500"
    >
      <div
        class="w-16 h-16 sm:w-12 sm:h-12 md:w-20 md:h-20 mb-6 sm:mb-4 md:mb-8 text-gray-400"
      >
        <svg
          class="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3
        class="text-xl sm:text-lg md:text-2xl font-semibold text-gray-600 mb-2"
      >
        {{ emptyStateTitle }}
      </h3>
      <p
        class="text-base sm:text-sm md:text-lg text-gray-500 max-w-xs md:max-w-sm leading-relaxed"
      >
        {{ emptyStateDescription }}
      </p>
    </div>

    <!-- Task items with animations -->
    <TransitionGroup
      v-else
      name="task-list"
      tag="ul"
      class="flex flex-col gap-3 sm:gap-2 md:gap-4 list-none p-0 m-0"
      :id="`task-list-${currentFilter}`"
      :aria-label="`${filteredTasks.length} ${currentFilter} tasks`"
    >
      <li v-for="task in filteredTasks" :key="task.id" class="list-none">
        <TaskItem
          :task="task"
          @toggle-complete="$emit('toggle-complete', $event)"
          @delete="$emit('delete', $event)"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from "vue";
import TaskItem from "../molecules/TaskItem.vue";

// Props definition
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => [],
  },
  currentFilter: {
    type: String,
    required: true,
    validator: (value) => ["all", "pending", "completed"].includes(value),
  },
});

// Emits definition
defineEmits(["toggle-complete", "delete"]);

// Computed properties
const filteredTasks = computed(() => {
  switch (props.currentFilter) {
    case "pending":
      return props.tasks.filter((task) => !task.completed);
    case "completed":
      return props.tasks.filter((task) => task.completed);
    default:
      return props.tasks;
  }
});

const emptyStateTitle = computed(() => {
  switch (props.currentFilter) {
    case "pending":
      return "No pending tasks";
    case "completed":
      return "No completed tasks";
    default:
      return "No tasks yet";
  }
});

const emptyStateDescription = computed(() => {
  switch (props.currentFilter) {
    case "pending":
      return "All tasks are completed! Great job! 🎉";
    case "completed":
      return "Complete some tasks to see them here.";
    default:
      return "Add your first task to get started.";
  }
});
</script>

<style scoped>
/* Animation styles */
.task-list-enter-active {
  transition: all 0.3s ease;
}

.task-list-leave-active {
  transition: all 0.2s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.task-list-move {
  transition: transform 0.3s ease;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .task-list-enter-active,
  .task-list-leave-active,
  .task-list-move {
    transition: none;
  }

  .task-list-enter-from,
  .task-list-leave-to {
    transform: none;
  }
}
</style>
