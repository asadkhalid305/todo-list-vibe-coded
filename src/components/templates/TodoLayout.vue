<!-- 
  TEMPLATE: Todo App Layout
  Main layout template that combines all organisms using Tailwind utilities
-->
<template>
  <div class="min-h-screen flex flex-col theme-bg-primary">
    <!-- Container with responsive margins and padding using pure Tailwind -->
    <div class="container mx-auto min-h-screen flex flex-col max-w-4xl">
      <!-- Header -->
      <header class="py-8 pt-6 sm:py-6 sm:pt-4 lg:py-12 lg:pt-10">
        <div class="flex items-center justify-between gap-4">
          <div class="text-center flex-1">
            <h1
              class="text-3xl sm:text-2xl lg:text-5xl font-semibold theme-text-primary mb-2 flex items-center justify-center gap-3 sm:gap-2"
            >
              <span
                class="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-purple-500 text-purple-50 rounded-2xl text-lg sm:text-xl lg:text-2xl font-bold shadow-md transition-all duration-300 dark:from-purple-800 dark:to-purple-700 dark:text-purple-100"
              >
                <svg
                  class="w-full h-full p-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              To-Do List
            </h1>
            <p
              class="text-lg sm:text-base lg:text-xl theme-text-secondary font-normal"
            >
              Stay organized and get things done
            </p>
          </div>

          <!-- Dark Mode Toggle -->
          <div class="flex items-center">
            <DarkModeToggle
              :model-value="isDarkMode"
              @update:model-value="handleThemeToggle"
            />
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main
        class="flex-1 flex flex-col gap-6 sm:gap-4 md:gap-8 lg:gap-10 pb-8 sm:pb-6 lg:pb-12 theme-bg-primary"
      >
        <!-- Add task form -->
        <section class="w-full" aria-label="Add new task">
          <TaskForm :is-submitting="isSubmitting" @add-task="handleAddTask" />
        </section>

        <!-- Filter tabs -->
        <section v-if="totalTasks > 0" class="w-full" aria-label="Filter tasks">
          <FilterTabs
            :current-filter="currentFilter"
            :total-tasks="totalTasks"
            :completed-tasks="completedTasks"
            :pending-tasks="pendingTasks"
            @filter-change="handleFilterChange"
          />
        </section>

        <!-- Task list -->
        <section
          class="w-full min-h-[200px] flex flex-col"
          aria-label="Task list"
        >
          <TaskList
            :tasks="tasks"
            :current-filter="currentFilter"
            @toggle-complete="handleToggleComplete"
            @delete="handleDeleteTask"
          />
        </section>

        <!-- Task summary -->
        <Transition name="summary" mode="out-in">
          <section
            v-if="totalTasks > 0"
            key="summary-present"
            class="w-full"
            aria-label="Task summary"
          >
            <TaskSummary
              :total-tasks="totalTasks"
              :completed-tasks="completedTasks"
              :pending-tasks="pendingTasks"
            />
          </section>
        </Transition>
      </main>

      <!-- Footer -->
      <footer
        class="mt-auto py-6 sm:py-4 text-center border-t border-gray-200 dark:border-gray-700 theme-bg-secondary"
      >
        <p class="text-sm theme-text-secondary">Built with Vue 3 & ❤️</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "@/types/task";
import type { FilterType } from "@/types/filter";
import TaskForm from "../molecules/TaskForm.vue";
import FilterTabs from "../molecules/FilterTabs.vue";
import TaskList from "../organisms/TaskList.vue";
import TaskSummary from "../organisms/TaskSummary.vue";
import DarkModeToggle from "../atoms/DarkModeToggle.vue";

// Props definition
interface Props {
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  currentFilter: FilterType;
  isSubmitting?: boolean;
  isDarkMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  isDarkMode: false,
});

// Emits definition
interface Emits {
  (e: "add-task", taskText: string): void;
  (e: "toggle-task", taskId: number): void;
  (e: "delete-task", taskId: number): void;
  (e: "set-filter", filter: FilterType): void;
  (e: "toggle-theme", isDark: boolean): void;
}

const emit = defineEmits<Emits>();

// Event handlers
const handleAddTask = (taskText: string): void => {
  emit("add-task", taskText);
};

const handleToggleComplete = (taskId: number): void => {
  emit("toggle-task", taskId);
};

const handleDeleteTask = (taskId: number): void => {
  emit("delete-task", taskId);
};

const handleFilterChange = (filter: FilterType): void => {
  emit("set-filter", filter);
};

const handleThemeToggle = (isDark: boolean): void => {
  emit("toggle-theme", isDark);
};
</script>

<style scoped>
/* High contrast mode */
@media (prefers-contrast: high) {
  .bg-gradient-to-br {
    background: var(--slate-900);
  }

  .border-t {
    border-top-color: var(--slate-400);
  }
}

/* Task Summary Transition Animations */
.summary-enter-active,
.summary-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.summary-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.summary-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .duration-300,
  .transition-all,
  .summary-enter-active,
  .summary-leave-active {
    transition: none !important;
  }

  .summary-enter-from,
  .summary-leave-to {
    transform: none;
  }
}
</style>
