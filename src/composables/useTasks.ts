/**
 * Task Management Composable
 * Handles all task-related operations (CRUD, sorting, state management)
 */

import { ref, computed, nextTick } from "vue";
import type { Ref, ComputedRef } from "vue";
import type { Task } from "../types";

export function useTasks() {
  // Reactive state
  const tasks: Ref<Task[]> = ref([]);
  const nextId: Ref<number> = ref(1);
  const isSubmitting: Ref<boolean> = ref(false);

  // Computed properties
  const sortedTasks: ComputedRef<Task[]> = computed(() => {
    return [...tasks.value].sort((a, b) => {
      // Sort by completion status (pending first), then by creation order
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.id - b.id;
    });
  });

  const completedTasks: ComputedRef<Task[]> = computed(() =>
    tasks.value.filter((task) => task.completed)
  );

  const pendingTasks: ComputedRef<Task[]> = computed(() =>
    tasks.value.filter((task) => !task.completed)
  );

  const taskStats = computed(() => ({
    total: tasks.value.length,
    completed: completedTasks.value.length,
    pending: pendingTasks.value.length,
    completionPercentage:
      tasks.value.length === 0
        ? 0
        : Math.round((completedTasks.value.length / tasks.value.length) * 100),
  }));

  // Task management methods
  const addTask = async (taskText: string): Promise<Task | false> => {
    if (!taskText || !taskText.trim()) {
      return false;
    }

    const trimmedText = taskText.trim();
    if (trimmedText.length > 200) {
      throw new Error("Task cannot exceed 200 characters");
    }

    isSubmitting.value = true;

    try {
      // Simulate async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newTask: Task = {
        id: nextId.value++,
        text: trimmedText,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      tasks.value.push(newTask);

      // Auto-focus management could be handled by the component
      await nextTick();

      return newTask;
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  const toggleTaskComplete = (taskId: number): Task | null => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = new Date().toISOString();
      return task;
    }
    return null;
  };

  const deleteTask = (taskId: number): Task | null => {
    const index = tasks.value.findIndex((t) => t.id === taskId);
    if (index > -1) {
      const deletedTask = tasks.value.splice(index, 1)[0];
      return deletedTask;
    }
    return null;
  };

  const updateTask = (taskId: number, updates: Partial<Task>): Task | null => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      Object.assign(task, updates, {
        updatedAt: new Date().toISOString(),
      });
      return task;
    }
    return null;
  };

  const clearCompleted = (): number => {
    const completedCount = completedTasks.value.length;
    tasks.value = tasks.value.filter((task) => !task.completed);
    return completedCount;
  };

  const getTaskById = (taskId: number): Task | undefined => {
    return tasks.value.find((t) => t.id === taskId);
  };

  // Bulk operations
  const markAllComplete = (): void => {
    tasks.value.forEach((task) => {
      if (!task.completed) {
        task.completed = true;
        task.updatedAt = new Date().toISOString();
      }
    });
  };

  const markAllIncomplete = (): void => {
    tasks.value.forEach((task) => {
      if (task.completed) {
        task.completed = false;
        task.updatedAt = new Date().toISOString();
      }
    });
  };

  // Initialize with sample data
  const initializeSampleData = (): void => {
    tasks.value = [
      {
        id: 1,
        text: "Welcome to your To-Do app! 👋",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        text: "Try adding a new task above",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        text: "Mark this task as complete",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    nextId.value = 4;
  };

  // Reset all data
  const resetTasks = (): void => {
    tasks.value = [];
    nextId.value = 1;
  };

  // Export state and methods
  return {
    // State
    tasks,
    nextId,
    isSubmitting,

    // Computed
    sortedTasks,
    completedTasks,
    pendingTasks,
    taskStats,

    // Methods
    addTask,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    clearCompleted,
    getTaskById,
    markAllComplete,
    markAllIncomplete,
    initializeSampleData,
    resetTasks,
  };
}
