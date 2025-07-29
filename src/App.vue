<!-- 
  PAGE: Main App Component
  Root component that manages state and provides localStorage persistence
-->
<template>
  <TodoLayout
    :tasks="sortedTasks"
    :current-filter="currentFilter"
    :is-submitting="isSubmitting"
    :is-dark-mode="isDarkMode"
    @add-task="addTask"
    @toggle-complete="toggleTaskComplete"
    @delete-task="deleteTask"
    @filter-change="setCurrentFilter"
    @theme-toggle="toggleTheme"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import TodoLayout from "./components/templates/TodoLayout.vue";

// Reactive state
const tasks = ref([]);
const currentFilter = ref("all");
const isSubmitting = ref(false);
const nextId = ref(1);
const isDarkMode = ref(false);

// localStorage key
const STORAGE_KEY = "vue-todo-app";

// Theme management
const applyTheme = (dark) => {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

// Computed properties
const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    // Sort by completion status (pending first), then by creation order
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.id - b.id;
  });
});

// Task management methods
const addTask = async (taskText) => {
  if (!taskText.trim()) return;

  isSubmitting.value = true;

  // Simulate async operation (e.g., API call)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newTask = {
    id: nextId.value++,
    text: taskText.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.value.push(newTask);
  isSubmitting.value = false;

  // Auto-focus on the form input after adding (accessibility)
  await nextTick();
  // Note: Focus management could be improved with refs if needed
};

const toggleTaskComplete = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
  }
};

const deleteTask = (taskId) => {
  const index = tasks.value.findIndex((t) => t.id === taskId);
  if (index > -1) {
    tasks.value.splice(index, 1);
  }
};

const setCurrentFilter = (filter) => {
  currentFilter.value = filter;
};

const toggleTheme = (isDark) => {
  isDarkMode.value = isDark;
  applyTheme(isDark);
};

// localStorage persistence
const saveToStorage = () => {
  try {
    const dataToSave = {
      tasks: tasks.value,
      nextId: nextId.value,
      currentFilter: currentFilter.value,
      isDarkMode: isDarkMode.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Validate and restore data
      if (Array.isArray(parsed.tasks)) {
        tasks.value = parsed.tasks.map((task) => ({
          id: task.id || nextId.value++,
          text: task.text || "",
          completed: Boolean(task.completed),
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt,
        }));
      }

      if (typeof parsed.nextId === "number") {
        nextId.value = Math.max(parsed.nextId, tasks.value.length + 1);
      }

      if (["all", "pending", "completed"].includes(parsed.currentFilter)) {
        currentFilter.value = parsed.currentFilter;
      }
      
      if (typeof parsed.isDarkMode === "boolean") {
        isDarkMode.value = parsed.isDarkMode;
        applyTheme(parsed.isDarkMode);
      }
    } else {
      // Check for system preference if no saved setting
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkMode.value = prefersDark;
      applyTheme(prefersDark);
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    // Initialize with sample data if loading fails
    initializeSampleData();
  }
};

const initializeSampleData = () => {
  // Add some sample tasks for demonstration
  tasks.value = [
    {
      id: 1,
      text: "Welcome to your To-Do app! 👋",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      text: "Try adding a new task above",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      text: "Mark this task as complete",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
  nextId.value = 4;
};

// Handle browser storage events (for sync across tabs)
const handleStorageChange = (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      const newData = JSON.parse(event.newValue);
      if (Array.isArray(newData.tasks)) {
        tasks.value = newData.tasks;
        nextId.value = newData.nextId || tasks.value.length + 1;
        currentFilter.value = newData.currentFilter || "all";
      }
    } catch (error) {
      console.warn("Failed to sync storage change:", error);
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  loadFromStorage();

  // Listen for storage changes in other tabs
  window.addEventListener("storage", handleStorageChange);

  // Save on page unload
  window.addEventListener("beforeunload", saveToStorage);
});

// Watch for changes and save to localStorage
watch(
  [tasks, currentFilter, nextId, isDarkMode],
  () => {
    saveToStorage();
  },
  { deep: true }
);

// Watch for system theme changes
watch(
  () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  (prefersDark) => {
    // Only auto-update if user hasn't manually set a preference
    const hasManualPreference = localStorage.getItem(STORAGE_KEY) && 
      JSON.parse(localStorage.getItem(STORAGE_KEY)).hasOwnProperty('isDarkMode');
    
    if (!hasManualPreference) {
      isDarkMode.value = prefersDark;
      applyTheme(prefersDark);
    }
  }
);
</script>

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
