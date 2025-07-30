/**
 * Composable for keyboard shortcuts and accessibility
 * Provides centralized keyboard event handling and shortcuts
 */

import { onMounted, onUnmounted, ref, readonly } from "vue";

export const useKeyboardShortcuts = () => {
  const shortcuts = ref(new Map());
  const isEnabled = ref(true);

  // Key combination helper
  const createKeyCombo = (key, modifiers = {}) => {
    return {
      key: key.toLowerCase(),
      ctrl: modifiers.ctrl || false,
      alt: modifiers.alt || false,
      shift: modifiers.shift || false,
      meta: modifiers.meta || false,
    };
  };

  // Check if key event matches shortcut
  const matchesShortcut = (event, shortcut) => {
    return (
      event.key.toLowerCase() === shortcut.key &&
      event.ctrlKey === shortcut.ctrl &&
      event.altKey === shortcut.alt &&
      event.shiftKey === shortcut.shift &&
      event.metaKey === shortcut.meta
    );
  };

  // Register a keyboard shortcut
  const registerShortcut = (keyCombo, callback, options = {}) => {
    const {
      description = "",
      category = "general",
      preventDefault = true,
      stopPropagation = true,
      element = document,
      enabled = true,
    } = options;

    const shortcutId = `${keyCombo.key}-${keyCombo.ctrl}-${keyCombo.alt}-${keyCombo.shift}-${keyCombo.meta}`;

    const shortcut = {
      id: shortcutId,
      ...keyCombo,
      callback,
      description,
      category,
      preventDefault,
      stopPropagation,
      element,
      enabled,
    };

    shortcuts.value.set(shortcutId, shortcut);
    return shortcutId;
  };

  // Unregister a keyboard shortcut
  const unregisterShortcut = (shortcutId) => {
    return shortcuts.value.delete(shortcutId);
  };

  // Handle keyboard events
  const handleKeyDown = (event) => {
    if (!isEnabled.value) return;

    // Skip if user is typing in an input element
    const activeElement = document.activeElement;
    const isInputElement =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true");

    for (const [, shortcut] of shortcuts.value) {
      if (!shortcut.enabled) continue;

      if (matchesShortcut(event, shortcut)) {
        // Skip input-specific shortcuts when not in input
        if (shortcut.category === "input" && !isInputElement) continue;

        // Skip global shortcuts when in input (unless specifically allowed)
        if (
          shortcut.category !== "input" &&
          isInputElement &&
          !shortcut.allowInInput
        )
          continue;

        if (shortcut.preventDefault) {
          event.preventDefault();
        }

        if (shortcut.stopPropagation) {
          event.stopPropagation();
        }

        shortcut.callback(event);
        break;
      }
    }
  };

  // Common shortcut presets for todo app
  const todoShortcuts = {
    // Task management
    addTask: (callback) =>
      registerShortcut(createKeyCombo("n", { ctrl: true }), callback, {
        description: "Add new task",
        category: "task",
      }),

    toggleTheme: (callback) =>
      registerShortcut(createKeyCombo("d", { ctrl: true }), callback, {
        description: "Toggle dark mode",
        category: "ui",
      }),

    focusSearch: (callback) =>
      registerShortcut(createKeyCombo("f", { ctrl: true }), callback, {
        description: "Focus search/input",
        category: "navigation",
      }),

    // Filter shortcuts
    showAll: (callback) =>
      registerShortcut(createKeyCombo("1", { ctrl: true }), callback, {
        description: "Show all tasks",
        category: "filter",
      }),

    showPending: (callback) =>
      registerShortcut(createKeyCombo("2", { ctrl: true }), callback, {
        description: "Show pending tasks",
        category: "filter",
      }),

    showCompleted: (callback) =>
      registerShortcut(createKeyCombo("3", { ctrl: true }), callback, {
        description: "Show completed tasks",
        category: "filter",
      }),

    // Form shortcuts
    submitForm: (callback) =>
      registerShortcut(createKeyCombo("enter"), callback, {
        description: "Submit form",
        category: "input",
        allowInInput: true,
      }),

    clearForm: (callback) =>
      registerShortcut(createKeyCombo("escape"), callback, {
        description: "Clear form/cancel",
        category: "input",
      }),

    // Navigation
    nextTask: (callback) =>
      registerShortcut(createKeyCombo("j"), callback, {
        description: "Next task",
        category: "navigation",
      }),

    previousTask: (callback) =>
      registerShortcut(createKeyCombo("k"), callback, {
        description: "Previous task",
        category: "navigation",
      }),

    // Quick actions
    toggleComplete: (callback) =>
      registerShortcut(
        createKeyCombo(" "), // Space
        callback,
        { description: "Toggle task completion", category: "task" }
      ),

    deleteTask: (callback) =>
      registerShortcut(createKeyCombo("delete"), callback, {
        description: "Delete selected task",
        category: "task",
      }),
  };

  // Get shortcuts by category
  const getShortcutsByCategory = (category) => {
    return Array.from(shortcuts.value.values()).filter(
      (s) => s.category === category
    );
  };

  // Get all shortcuts formatted for help display
  const getShortcutHelp = () => {
    const categories = {};

    for (const shortcut of shortcuts.value.values()) {
      if (!categories[shortcut.category]) {
        categories[shortcut.category] = [];
      }

      const keyDisplay = [];
      if (shortcut.ctrl) keyDisplay.push("Ctrl");
      if (shortcut.alt) keyDisplay.push("Alt");
      if (shortcut.shift) keyDisplay.push("Shift");
      if (shortcut.meta) keyDisplay.push("Cmd");
      keyDisplay.push(shortcut.key.toUpperCase());

      categories[shortcut.category].push({
        keys: keyDisplay.join(" + "),
        description: shortcut.description,
      });
    }

    return categories;
  };

  // Enable/disable shortcuts
  const enableShortcuts = () => {
    isEnabled.value = true;
  };

  const disableShortcuts = () => {
    isEnabled.value = false;
  };

  const toggleShortcuts = () => {
    isEnabled.value = !isEnabled.value;
  };

  // Setup and cleanup
  onMounted(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown);
    shortcuts.value.clear();
  });

  return {
    // State
    shortcuts: readonly(shortcuts),
    isEnabled,

    // Methods
    registerShortcut,
    unregisterShortcut,
    createKeyCombo,

    // Presets
    todoShortcuts,

    // Utilities
    getShortcutsByCategory,
    getShortcutHelp,
    enableShortcuts,
    disableShortcuts,
    toggleShortcuts,
  };
};

// Specialized hook for form keyboard handling
export const useFormKeyboard = (options = {}) => {
  const { onSubmit, onCancel, onClear } = options;
  const keyboard = useKeyboardShortcuts();

  // Register form-specific shortcuts
  const setupFormShortcuts = () => {
    const shortcuts = [];

    if (onSubmit) {
      shortcuts.push(keyboard.todoShortcuts.submitForm(onSubmit));
    }

    if (onCancel || onClear) {
      shortcuts.push(keyboard.todoShortcuts.clearForm(onCancel || onClear));
    }

    return shortcuts;
  };

  // Input event handlers
  const handleInputKeydown = (event, customHandlers = {}) => {
    const { onEnter, onEscape, onArrowUp, onArrowDown } = customHandlers;

    switch (event.key) {
      case "Enter":
        if (onEnter) {
          event.preventDefault();
          onEnter(event);
        }
        break;

      case "Escape":
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;

      case "ArrowUp":
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;

      case "ArrowDown":
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  };

  return {
    ...keyboard,
    setupFormShortcuts,
    handleInputKeydown,
  };
};

// Hook for task list navigation
export const useTaskNavigation = (tasks, selectedTaskId, onTaskSelect) => {
  const keyboard = useKeyboardShortcuts();

  const navigateToNext = () => {
    if (!tasks.value || tasks.value.length === 0) return;

    const currentIndex = tasks.value.findIndex(
      (task) => task.id === selectedTaskId.value
    );
    const nextIndex =
      currentIndex < tasks.value.length - 1 ? currentIndex + 1 : 0;

    onTaskSelect(tasks.value[nextIndex].id);
  };

  const navigateToPrevious = () => {
    if (!tasks.value || tasks.value.length === 0) return;

    const currentIndex = tasks.value.findIndex(
      (task) => task.id === selectedTaskId.value
    );
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : tasks.value.length - 1;

    onTaskSelect(tasks.value[prevIndex].id);
  };

  // Register navigation shortcuts
  keyboard.todoShortcuts.nextTask(navigateToNext);
  keyboard.todoShortcuts.previousTask(navigateToPrevious);

  return {
    navigateToNext,
    navigateToPrevious,
    ...keyboard,
  };
};
