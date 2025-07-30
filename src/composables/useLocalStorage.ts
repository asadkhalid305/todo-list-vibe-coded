/**
 * Composable for local storage operations with validation and auto-save
 */

import { watch } from "vue";
import type { Ref } from "vue";
import type {
  StorageData,
  StorageOptions,
  StorageEventHandler,
  CleanupFunction,
  Task,
} from "../types";

export const useLocalStorage = () => {
  let storageEventHandler: ((event: StorageEvent) => void) | null = null;

  // Save data to localStorage
  const saveToStorage = (data: StorageData, key = "todo-app-data"): boolean => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
      return false;
    }
  };

  // Load data from localStorage
  const loadFromStorage = (key = "todo-app-data"): StorageData | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.warn("Failed to load from localStorage:", error);
      return null;
    }
  };

  // Validate and sanitize task data
  const validateTaskData = (
    tasks: any,
    nextId: number = 1
  ): { tasks: Task[]; nextId: number } => {
    if (!Array.isArray(tasks)) {
      return { tasks: [], nextId: 1 };
    }

    const validatedTasks = tasks.map((task, index) => ({
      id: task.id || nextId + index,
      text: task.text || "",
      completed: Boolean(task.completed),
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || task.createdAt || new Date().toISOString(),
    }));

    const maxId = validatedTasks.reduce(
      (max, task) => Math.max(max, task.id),
      0
    );
    const validatedNextId = Math.max(nextId, maxId + 1);

    return {
      tasks: validatedTasks,
      nextId: validatedNextId,
    };
  };

  // Setup automatic saving when reactive data changes
  const setupAutoSave = (
    dataRefs: Record<string, Ref<any>>,
    options: StorageOptions = {}
  ): CleanupFunction => {
    const { immediate = false, deep = true, debounce = 0 } = options;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const saveData = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const save = () => {
        const dataToSave: Partial<StorageData> = {};

        // Collect data from all reactive references
        Object.entries(dataRefs).forEach(([key, ref]) => {
          (dataToSave as any)[key] = ref.value;
        });

        if (dataToSave.tasks && dataToSave.nextTaskId) {
          saveToStorage(dataToSave as StorageData);
        }
      };

      if (debounce > 0) {
        timeoutId = setTimeout(save, debounce);
      } else {
        save();
      }
    };

    // Watch all provided reactive references
    const stopWatchers = Object.values(dataRefs).map((ref) =>
      watch(ref, saveData, { deep, immediate })
    );

    // Return cleanup function
    return () => {
      stopWatchers.forEach((stop) => stop());
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  };

  // Setup cross-tab synchronization
  const setupCrossTabSync = (
    onStorageChange: StorageEventHandler,
    key = "todo-app-data"
  ): CleanupFunction => {
    storageEventHandler = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue);
          if (onStorageChange) {
            onStorageChange(newData);
          }
        } catch (error) {
          console.warn("Failed to sync storage change:", error);
        }
      }
    };

    window.addEventListener("storage", storageEventHandler);

    // Return cleanup function
    return () => {
      if (storageEventHandler) {
        window.removeEventListener("storage", storageEventHandler);
        storageEventHandler = null;
      }
    };
  };

  // Save data before page unload
  const setupBeforeUnloadSave = (
    getDataToSave: () => StorageData
  ): CleanupFunction => {
    const beforeUnloadHandler = () => {
      if (getDataToSave) {
        const data = getDataToSave();
        saveToStorage(data);
      }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    // Return cleanup function
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  };

  // Get storage info
  const getStorageInfo = (key = "todo-app-data") => {
    try {
      const used = new Blob([localStorage.getItem(key) || ""]).size;
      const quota = 5 * 1024 * 1024; // 5MB typical localStorage limit

      return {
        used,
        quota,
        available: quota - used,
        usagePercentage: (used / quota) * 100,
      };
    } catch (error) {
      return {
        used: 0,
        quota: 0,
        available: 0,
        usagePercentage: 0,
        error: (error as Error).message,
      };
    }
  };

  // Clear storage
  const clearStorage = (key = "todo-app-data"): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
      return false;
    }
  };

  // Check if localStorage is available
  const isStorageAvailable = () => {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Import/Export functionality
  const exportData = () => {
    const data = loadFromStorage();
    if (data) {
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };
      return JSON.stringify(exportData, null, 2);
    }
    return null;
  };

  const importData = (jsonString: string): boolean => {
    try {
      const importedData = JSON.parse(jsonString);

      // Validate imported data structure
      if (importedData && typeof importedData === "object") {
        // Remove export metadata
        const { exportedAt, version, ...dataToImport } = importedData;

        return saveToStorage(dataToImport as StorageData);
      }
      return false;
    } catch (error) {
      console.warn("Failed to import data:", error);
      return false;
    }
  };

  return {
    saveToStorage,
    loadFromStorage,
    validateTaskData,
    setupAutoSave,
    setupCrossTabSync,
    setupBeforeUnloadSave,
    getStorageInfo,
    clearStorage,
    isStorageAvailable,
    exportData,
    importData,
  };
};
