<!-- 
  ORGANISM: Task List Component
  Container for displaying filtered list of tasks with animations
-->
<template>
  <div class="task-list">
    <!-- Empty state -->
    <div v-if="filteredTasks.length === 0" class="task-list__empty">
      <div class="task-list__empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="task-list__empty-title">{{ emptyStateTitle }}</h3>
      <p class="task-list__empty-description">{{ emptyStateDescription }}</p>
    </div>

    <!-- Task items with animations -->
    <TransitionGroup
      v-else
      name="task-list"
      tag="ul"
      class="task-list__items"
      :id="`task-list-${currentFilter}`"
      :aria-label="`${filteredTasks.length} ${currentFilter} tasks`"
    >
      <li v-for="task in filteredTasks" :key="task.id" class="task-list__item">
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
.task-list {
  width: 100%;
}

.task-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list__item {
  list-style: none;
}

/* Empty state styles */
.task-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12) var(--space-6);
  color: var(--gray-500);
}

.task-list__empty-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: var(--space-6);
  color: var(--gray-400);
}

.task-list__empty-icon svg {
  width: 100%;
  height: 100%;
}

.task-list__empty-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
}

.task-list__empty-description {
  font-size: var(--font-size-base);
  color: var(--gray-500);
  max-width: 300px;
  line-height: 1.6;
}

/* Animation styles */
.task-list-enter-active {
  transition: all var(--transition-normal);
}

.task-list-leave-active {
  transition: all var(--transition-fast);
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
  transition: transform var(--transition-normal);
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .task-list__items {
    gap: var(--space-2);
  }

  .task-list__empty {
    padding: var(--space-8) var(--space-4);
  }

  .task-list__empty-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: var(--space-4);
  }

  .task-list__empty-title {
    font-size: var(--font-size-lg);
  }

  .task-list__empty-description {
    font-size: var(--font-size-sm);
  }
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .task-list__items {
    gap: var(--space-4);
  }

  .task-list__empty {
    padding: var(--space-16) var(--space-8);
  }

  .task-list__empty-icon {
    width: 5rem;
    height: 5rem;
    margin-bottom: var(--space-8);
  }

  .task-list__empty-title {
    font-size: var(--font-size-2xl);
  }

  .task-list__empty-description {
    font-size: var(--font-size-lg);
    max-width: 400px;
  }
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
