<!-- 
  PAGE: Main App Component
  Root component that uses composables for state management
-->
<!-- 
  PAGE: Main App Component
  Root component that uses composables for state management
-->
<template>
  <TodoLayout
    :tasks="filteredTasks"
    :total-tasks="taskCounts.all"
    :completed-tasks="taskCounts.completed"
    :pending-tasks="taskCounts.pending"
    :current-filter="currentFilter"
    :is-submitting="isSubmitting"
    :is-dark-mode="isDarkMode"
    @add-task="addTask"
    @toggle-task="toggleTask"
    @delete-task="deleteTask"
    @set-filter="setFilter"
    @toggle-theme="toggleTheme"
  />
</template>

<script setup>
import TodoLayout from "./components/templates/TodoLayout.vue";
import { useAppState } from "./composables/useAppState";

// Use the main app state composable
const {
  // State
  filteredTasks,
  currentFilter,
  isSubmitting,
  isDarkMode,
  taskCounts,

  // Actions
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
  toggleTheme,
} = useAppState();
</script>

<style>
/* Global styles that should not be scoped */
#app {
  width: 100%;
  min-height: 100vh;
}
</style>

<style>
/* Global styles that should not be scoped */
#app {
  width: 100%;
  min-height: 100vh;
}

/* Ensure proper font loading */
body {
  font-display: swap;
}

/* Smooth scrolling for better UX */
html {
  scroll-behavior: smooth;
}

/* High contrast mode adjustments */
@media (prefers-contrast: high) {
  * {
    border-color: currentColor !important;
  }
}

/* Print styles */
@media print {
  .task-summary,
  .filter-tabs,
  .task-form {
    display: none !important;
  }

  .todo-layout {
    background: white !important;
  }

  .task-item {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #000 !important;
  }
}
</style>
