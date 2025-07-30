/**
 * Local Storage Composable
 * Handles data persistence, loading, and cross-tab synchronization
 */

import { watch, onMounted, onUnmounted } from "vue";

export function useLocalStorage(key = "vue-todo-app") {
  // Storage event handler for cross-tab sync
  let storageEventHandler = null;

  // Save data to localStorage
  const saveToStorage = (data) => {
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
  const loadFromStorage = () => {
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
  const validateTaskData = (tasks, nextId = 1) => {
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
  const setupAutoSave = (dataRefs, options = {}) => {
    const { immediate = false, deep = true, debounce = 0 } = options;

    let timeoutId = null;

    const saveData = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const save = () => {
        const dataToSave = {};

        // Collect data from all reactive references
        Object.entries(dataRefs).forEach(([key, ref]) => {
          dataToSave[key] = ref.value;
        });

        saveToStorage(dataToSave);
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
  const setupCrossTabSync = (onStorageChange) => {
    storageEventHandler = (event) => {
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
  const setupBeforeUnloadSave = (getDataToSave) => {
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
  const getStorageInfo = () => {
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
        error: error.message,
      };
    }
  };

  // Clear storage
  const clearStorage = () => {
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

  const importData = (jsonString) => {
    try {
      const importedData = JSON.parse(jsonString);

      // Validate imported data structure
      if (importedData && typeof importedData === "object") {
        // Remove export metadata
        const { exportedAt, version, ...dataToImport } = importedData;

        return saveToStorage(dataToImport);
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
}
