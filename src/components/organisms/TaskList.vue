<!-- 
  ORGANISM: Task List Component
  Container for displaying filtered list of tasks with animations using Tailwind utilities
-->
<template>
  <div class="w-full flex-1">
    <Transition name="list-container" mode="out-in">
      <div :key="currentFilter" class="task-list-container">
        <!-- Empty state -->
        <div
          v-if="filteredTasks.length === 0"
          class="flex flex-col items-center justify-center text-center px-6 py-12 sm:px-4 sm:py-8 md:px-8 md:py-16 theme-text-secondary min-h-[200px]"
        >
          <div
            class="w-16 h-16 sm:w-12 sm:h-12 md:w-20 md:h-20 mb-6 sm:mb-4 md:mb-8 theme-text-muted"
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
            class="text-xl sm:text-lg md:text-2xl font-semibold theme-text-secondary mb-2"
          >
            {{ emptyStateTitle }}
          </h3>
          <p
            class="text-base sm:text-sm md:text-lg theme-text-muted max-w-xs md:max-w-sm leading-relaxed"
          >
            {{ emptyStateDescription }}
          </p>
        </div>

        <!-- Task items with animations -->
        <TransitionGroup
          v-else
          name="task-list"
          tag="ul"
          class="flex flex-col gap-3 sm:gap-2 md:gap-4 list-none p-0 m-0 min-h-[100px]"
          :id="`task-list-${currentFilter}`"
          :aria-label="`${filteredTasks.length} ${currentFilter} tasks`"
          appear
        >
          <li
            v-for="task in filteredTasks"
            :key="`${currentFilter}-${task.id}`"
            class="list-none"
          >
            <TaskItem
              :task="task"
              @toggle-complete="$emit('toggle-complete', $event)"
              @delete="$emit('delete', $event)"
            />
          </li>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "@/types/task";
import type { FilterType } from "@/types/filter";
import TaskItem from "../molecules/TaskItem.vue";

// Props definition
interface Props {
  tasks: Task[];
  currentFilter: FilterType;
}

const props = defineProps<Props>();

// Emits definition
interface Emits {
  (e: "toggle-complete", taskId: number): void;
  (e: "delete", taskId: number): void;
}

defineEmits<Emits>();

// Computed properties
const filteredTasks = computed((): Task[] => {
  switch (props.currentFilter) {
    case "pending":
      return props.tasks.filter((task) => !task.completed);
    case "completed":
      return props.tasks.filter((task) => task.completed);
    default:
      return props.tasks;
  }
});

const emptyStateTitle = computed((): string => {
  switch (props.currentFilter) {
    case "pending":
      return "No pending tasks";
    case "completed":
      return "No completed tasks";
    default:
      return "No tasks yet";
  }
});

const emptyStateDescription = computed((): string => {
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
/* Enhanced animation styles for smooth tab transitions */
.task-list-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-delay: calc(var(--task-index, 0) * 0.05s);
}

.task-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  transition-delay: calc(var(--task-index, 0) * 0.03s);
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.task-list-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Container transition for smoother tab switching */
.list-container-enter-active,
.list-container-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.list-container-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-container-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.task-list-container {
  transition: height 0.3s ease-out, opacity 0.2s ease-out;
}

/* Staggered animation for multiple items */
.task-list-enter-active:nth-child(1) {
  transition-delay: 0.05s;
}
.task-list-enter-active:nth-child(2) {
  transition-delay: 0.1s;
}
.task-list-enter-active:nth-child(3) {
  transition-delay: 0.15s;
}
.task-list-enter-active:nth-child(4) {
  transition-delay: 0.2s;
}
.task-list-enter-active:nth-child(5) {
  transition-delay: 0.25s;
}
.task-list-enter-active:nth-child(6) {
  transition-delay: 0.3s;
}
.task-list-enter-active:nth-child(7) {
  transition-delay: 0.35s;
}
.task-list-enter-active:nth-child(8) {
  transition-delay: 0.4s;
}

.task-list-leave-active:nth-child(1) {
  transition-delay: 0s;
}
.task-list-leave-active:nth-child(2) {
  transition-delay: 0.03s;
}
.task-list-leave-active:nth-child(3) {
  transition-delay: 0.06s;
}
.task-list-leave-active:nth-child(4) {
  transition-delay: 0.09s;
}
.task-list-leave-active:nth-child(5) {
  transition-delay: 0.12s;
}
.task-list-leave-active:nth-child(6) {
  transition-delay: 0.15s;
}
.task-list-leave-active:nth-child(7) {
  transition-delay: 0.18s;
}
.task-list-leave-active:nth-child(8) {
  transition-delay: 0.21s;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .task-list-enter-active,
  .task-list-leave-active,
  .task-list-move {
    transition: none !important;
    transition-delay: 0s !important;
  }

  .task-list-enter-from,
  .task-list-leave-to {
    transform: none;
  }
}
</style>
