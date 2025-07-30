/**
 * Main App State Composable
 * Orchestrates all other composables and provides the main app state management
 */

import { onMounted, onUnmounted } from "vue";
import type { StorageData, CleanupFunction } from "../types";
import { useTasks } from "./useTasks";
import { useLocalStorage } from "./useLocalStorage";
import { useTheme } from "./useTheme";
import { useFilters } from "./useFilters";

export function useAppState() {
  // Initialize all composables
  const taskManager = useTasks();
  const storage = useLocalStorage();
  const theme = useTheme();
  const filters = useFilters(taskManager.tasks);

  // Cleanup functions
  let cleanupAutoSave: CleanupFunction | null = null;
  let cleanupCrossTabSync: CleanupFunction | null = null;
  let cleanupBeforeUnload: CleanupFunction | null = null;

  // Initialize app data from storage
  const initializeApp = (): void => {
    const savedData = storage.loadFromStorage();

    if (savedData) {
      // Restore tasks
      if (savedData.tasks) {
        const { tasks: validatedTasks, nextId } = storage.validateTaskData(
          savedData.tasks,
          savedData.nextTaskId || savedData.nextId || 1
        );
        taskManager.tasks.value = validatedTasks;
        taskManager.nextId.value = nextId;
      }

      // Restore theme
      theme.initializeFromData(savedData);

      // Restore filters if they exist in the legacy format
      if (savedData.currentFilter || savedData.filters) {
        filters.restoreFilterState({
          currentFilter: (savedData.currentFilter ||
            savedData.filters?.currentFilter ||
            "all") as any,
          searchQuery:
            savedData.searchQuery || savedData.filters?.searchQuery || "",
          sortBy: (savedData.sortBy ||
            savedData.filters?.sortBy ||
            "created") as any,
          sortOrder: (savedData.sortOrder ||
            savedData.filters?.sortOrder ||
            "asc") as any,
        });
      }
    } else {
      // No saved data, initialize with sample data and system theme
      taskManager.initializeSampleData();
      theme.useSystemPreference();
    }
  };

  // Setup automatic persistence
  const setupPersistence = () => {
    // Setup auto-save for all reactive data
    cleanupAutoSave = storage.setupAutoSave(
      {
        tasks: taskManager.tasks,
        nextId: taskManager.nextId,
        currentFilter: filters.currentFilter,
        searchQuery: filters.searchQuery,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        isDarkMode: theme.isDarkMode,
        hasManualPreference: theme.hasManualPreference,
      },
      {
        debounce: 300, // Debounce saves by 300ms
        deep: true,
      }
    );

    // Setup cross-tab synchronization
    cleanupCrossTabSync = storage.setupCrossTabSync((newData) => {
      // Sync tasks
      if (newData.tasks) {
        const { tasks: validatedTasks, nextId } = storage.validateTaskData(
          newData.tasks,
          newData.nextId
        );
        taskManager.tasks.value = validatedTasks;
        taskManager.nextId.value = nextId;
      }

      // Sync filters
      if (newData.currentFilter) {
        filters.setFilter(newData.currentFilter as any);
      }

      // Sync theme (but don't override manual preference)
      if (
        !theme.hasManualPreference.value &&
        newData.isDarkMode !== undefined
      ) {
        theme.setTheme(newData.isDarkMode);
      }
    });

    // Setup before unload save
    cleanupBeforeUnload = storage.setupBeforeUnloadSave(() => ({
      tasks: taskManager.tasks.value,
      nextTaskId: taskManager.nextId.value,
      nextId: taskManager.nextId.value,
      currentFilter: filters.currentFilter.value,
      searchQuery: filters.searchQuery.value,
      sortBy: filters.sortBy.value,
      sortOrder: filters.sortOrder.value,
      isDarkMode: theme.isDarkMode.value,
      hasManualPreference: theme.hasManualPreference.value,
    }));
  };

  // Cleanup all event listeners and watchers
  const cleanup = () => {
    if (cleanupAutoSave) cleanupAutoSave();
    if (cleanupCrossTabSync) cleanupCrossTabSync();
    if (cleanupBeforeUnload) cleanupBeforeUnload();
  };

  // Export/Import functionality
  const exportAppData = () => {
    return storage.exportData();
  };

  const importAppData = (jsonString: string): boolean => {
    const success = storage.importData(jsonString);
    if (success) {
      // Reload app state after import
      initializeApp();
    }
    return success;
  };

  // App statistics
  const getAppStats = () => {
    const storageInfo = storage.getStorageInfo();
    const themeInfo = theme.getThemeInfo();
    const accessibilityInfo = theme.getAccessibilityInfo();

    return {
      tasks: taskManager.taskStats.value,
      storage: storageInfo,
      theme: themeInfo,
      accessibility: accessibilityInfo,
      filters: {
        active: filters.hasActiveFilters.value,
        description: filters.getFilterDescription.value,
        counts: filters.taskCounts.value,
      },
    };
  };

  // App actions that might be used by components
  const appActions = {
    // Task actions
    addTask: taskManager.addTask,
    toggleTask: taskManager.toggleTaskComplete,
    deleteTask: taskManager.deleteTask,
    updateTask: taskManager.updateTask,
    clearCompleted: taskManager.clearCompleted,
    markAllComplete: taskManager.markAllComplete,
    markAllIncomplete: taskManager.markAllIncomplete,

    // Filter actions
    setFilter: filters.setFilter,
    setSearch: filters.setSearch,
    clearSearch: filters.clearSearch,
    resetFilters: filters.resetFilters,

    // Theme actions
    toggleTheme: theme.toggleTheme,
    setTheme: theme.setTheme,
    useSystemTheme: theme.useSystemPreference,

    // Data management
    exportData: exportAppData,
    importData: importAppData,
    clearAllData: () => {
      storage.clearStorage();
      taskManager.resetTasks();
      filters.resetFilters();
      theme.useSystemPreference();
    },

    // Utility actions
    getStats: getAppStats,
  };

  // Lifecycle setup
  onMounted(() => {
    initializeApp();
    setupPersistence();
  });

  onUnmounted(() => {
    cleanup();
  });

  // Return all state and actions for components to use
  return {
    // State from different composables
    tasks: taskManager.sortedTasks, // Use sorted tasks by default
    filteredTasks: filters.filteredTasks,
    isSubmitting: taskManager.isSubmitting,
    currentFilter: filters.currentFilter,
    searchQuery: filters.searchQuery,
    isDarkMode: theme.isDarkMode,
    taskStats: taskManager.taskStats,
    taskCounts: filters.taskCounts,
    searchInfo: filters.searchInfo,

    // Available options
    availableFilters: filters.availableFilters,
    availableSortOptions: filters.availableSortOptions,

    // Actions
    ...appActions,

    // Composed state for common use cases
    hasActiveFilters: filters.hasActiveFilters,
    filterDescription: filters.getFilterDescription,
    themeInfo: theme.getThemeInfo,
    accessibilityInfo: theme.getAccessibilityInfo,

    // Utility methods
    isStorageAvailable: storage.isStorageAvailable,
    getStorageInfo: storage.getStorageInfo,

    // Advanced methods (for settings, debugging, etc.)
    setSorting: filters.setSorting,
    getCSSVariable: theme.getCSSVariable,
    setCSSVariable: theme.setCSSVariable,
    getThemeColors: theme.getThemeColors,
  };
}
