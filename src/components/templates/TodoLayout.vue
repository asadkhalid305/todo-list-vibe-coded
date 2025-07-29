<!-- 
  TEMPLATE: Todo App Layout
  Main layout template that combines all organisms
-->
<template>
  <div class="todo-layout">
    <div class="container">
      <!-- Header -->
      <header class="todo-layout__header">
        <div class="todo-layout__header-content">
          <div class="todo-layout__title-section">
            <h1 class="todo-layout__title">
              <span class="todo-layout__title-icon">
                <svg
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
            <p class="todo-layout__subtitle">
              Stay organized and get things done
            </p>
          </div>

          <!-- Dark Mode Toggle -->
          <div class="todo-layout__theme-toggle">
            <DarkModeToggle
              :model-value="isDarkMode"
              @update:model-value="handleThemeToggle"
            />
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="todo-layout__main">
        <!-- Add task form -->
        <section class="todo-layout__section" aria-label="Add new task">
          <TaskForm :is-submitting="isSubmitting" @add-task="handleAddTask" />
        </section>

        <!-- Filter tabs -->
        <section
          v-if="tasks.length > 0"
          class="todo-layout__section"
          aria-label="Filter tasks"
        >
          <FilterTabs
            :current-filter="currentFilter"
            :total-tasks="tasks.length"
            :completed-tasks="completedTasks"
            :pending-tasks="pendingTasks"
            @filter-change="handleFilterChange"
          />
        </section>

        <!-- Task list -->
        <section class="todo-layout__section" aria-label="Task list">
          <TaskList
            :tasks="tasks"
            :current-filter="currentFilter"
            @toggle-complete="handleToggleComplete"
            @delete="handleDeleteTask"
          />
        </section>

        <!-- Task summary -->
        <section
          v-if="tasks.length > 0"
          class="todo-layout__section"
          aria-label="Task summary"
        >
          <TaskSummary
            :total-tasks="tasks.length"
            :completed-tasks="completedTasks"
            :pending-tasks="pendingTasks"
          />
        </section>
      </main>

      <!-- Footer -->
      <footer class="todo-layout__footer">
        <p class="todo-layout__footer-text">Built with Vue 3 & ❤️</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import TaskForm from "../molecules/TaskForm.vue";
import FilterTabs from "../molecules/FilterTabs.vue";
import TaskList from "../organisms/TaskList.vue";
import TaskSummary from "../organisms/TaskSummary.vue";
import DarkModeToggle from "../atoms/DarkModeToggle.vue";

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
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
});

// Emits definition
const emit = defineEmits([
  "add-task",
  "toggle-complete",
  "delete-task",
  "filter-change",
  "theme-toggle",
]);

// Computed properties
const completedTasks = computed(
  () => props.tasks.filter((task) => task.completed).length
);

const pendingTasks = computed(
  () => props.tasks.filter((task) => !task.completed).length
);

// Event handlers
const handleAddTask = (taskText) => {
  emit("add-task", taskText);
};

const handleToggleComplete = (taskId) => {
  emit("toggle-complete", taskId);
};

const handleDeleteTask = (taskId) => {
  emit("delete-task", taskId);
};

const handleFilterChange = (filter) => {
  emit("filter-change", filter);
};

const handleThemeToggle = (isDark) => {
  emit("theme-toggle", isDark);
};
</script>

<style scoped>
.todo-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    var(--bg-primary) 0%,
    var(--bg-tertiary) 100%
  );
}

.todo-layout .container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.todo-layout__header {
  padding: var(--space-8) 0 var(--space-6) 0;
}

.todo-layout__header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.todo-layout__title-section {
  text-align: center;
  flex: 1;
}

.todo-layout__theme-toggle {
  display: flex;
  align-items: center;
}

.todo-layout__title {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.todo-layout__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--purple-400), var(--purple-500));
  color: var(--purple-50);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xl);
  font-weight: bold;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.todo-layout__subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  font-weight: 400;
}

.todo-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding-bottom: var(--space-8);
}

.todo-layout__section {
  width: 100%;
}

.todo-layout__footer {
  margin-top: auto;
  padding: var(--space-6) 0;
  text-align: center;
  border-top: 1px solid var(--border-primary);
  background-color: var(--bg-secondary);
}

.todo-layout__footer-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .todo-layout__header {
    padding: var(--space-6) 0 var(--space-4) 0;
  }

  .todo-layout__header-content {
    flex-direction: column;
    gap: var(--space-4);
  }

  .todo-layout__title-section {
    order: 1;
  }

  .todo-layout__theme-toggle {
    order: 0;
    align-self: flex-end;
  }

  .todo-layout__title {
    font-size: var(--font-size-2xl);
    gap: var(--space-2);
  }

  .todo-layout__title-icon {
    width: 2rem;
    height: 2rem;
    font-size: var(--font-size-lg);
  }

  .todo-layout__subtitle {
    font-size: var(--font-size-base);
  }

  .todo-layout__main {
    gap: var(--space-4);
    padding-bottom: var(--space-6);
  }

  .todo-layout__footer {
    padding: var(--space-4) 0;
  }
}

/* Tablet optimizations */
@media (min-width: 640px) and (max-width: 1023px) {
  .todo-layout__header {
    padding: var(--space-10) 0 var(--space-8) 0;
  }

  .todo-layout__main {
    gap: var(--space-8);
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .todo-layout__header {
    padding: var(--space-12) 0 var(--space-10) 0;
  }

  .todo-layout__title {
    font-size: 3rem;
  }

  .todo-layout__title-icon {
    width: 3rem;
    height: 3rem;
    font-size: var(--font-size-2xl);
  }

  .todo-layout__subtitle {
    font-size: var(--font-size-xl);
  }

  .todo-layout__main {
    gap: var(--space-10);
    padding-bottom: var(--space-12);
  }
}

/* Dark mode specific styles */
[data-theme="dark"] .todo-layout__title-icon {
  background: linear-gradient(135deg, var(--purple-800), var(--purple-700));
  color: var(--purple-100);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .todo-layout__title-icon {
    background: var(--slate-900);
  }

  .todo-layout__footer {
    border-top-color: var(--slate-400);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .todo-layout {
    background: var(--bg-primary);
  }
}
</style>
