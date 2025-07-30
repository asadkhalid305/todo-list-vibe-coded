import { onMounted, onUnmounted } from "vue";
import type {
  FormHandlerOptions,
  KeyboardShortcut,
  ShortcutOptions,
  RegisteredShortcut,
  KeyCombo,
} from "@/types/keyboard";

/**
 * Global keyboard shortcuts registry
 */
const shortcuts = new Map<string, RegisteredShortcut>();
let nextShortcutId = 0;

/**
 * Parse a key combination string into KeyCombo object
 */
function parseKeyCombo(keyString: string): KeyCombo {
  const parts = keyString.toLowerCase().split("+");
  const key = parts[parts.length - 1];

  return {
    key,
    ctrl: parts.includes("ctrl") || parts.includes("cmd"),
    alt: parts.includes("alt"),
    shift: parts.includes("shift"),
    meta: parts.includes("meta") || parts.includes("cmd"),
  };
}

/**
 * Check if a keyboard event matches a key combination
 */
function matchesKeyCombo(event: KeyboardEvent, combo: KeyCombo): boolean {
  return (
    event.key.toLowerCase() === combo.key.toLowerCase() &&
    event.ctrlKey === combo.ctrl &&
    event.altKey === combo.alt &&
    event.shiftKey === combo.shift &&
    event.metaKey === combo.meta
  );
}

/**
 * Global keyboard event handler
 */
function handleGlobalKeydown(event: KeyboardEvent): void {
  const activeElement = document.activeElement;
  const isInInput =
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    (activeElement as HTMLElement)?.contentEditable === "true";

  for (const shortcut of shortcuts.values()) {
    if (!shortcut.enabled) continue;

    // Skip if shortcut doesn't allow input and we're in an input
    if (isInInput && !shortcut.allowInInput) continue;

    if (matchesKeyCombo(event, shortcut.keyCombo)) {
      if (shortcut.preventDefault) {
        event.preventDefault();
      }
      if (shortcut.stopPropagation) {
        event.stopPropagation();
      }

      shortcut.callback(event);
      break; // Only trigger the first matching shortcut
    }
  }
}

/**
 * Register a keyboard shortcut
 */
export function registerShortcut(
  keyCombo: string | KeyCombo,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {}
): string {
  const id = `shortcut-${nextShortcutId++}`;
  const combo =
    typeof keyCombo === "string" ? parseKeyCombo(keyCombo) : keyCombo;

  const shortcut: RegisteredShortcut = {
    id,
    keyCombo: combo,
    callback,
    description: options.description,
    category: options.category || "general",
    preventDefault: options.preventDefault ?? true,
    stopPropagation: options.stopPropagation ?? false,
    enabled: options.enabled ?? true,
    allowInInput: options.allowInInput ?? false,
  };

  shortcuts.set(id, shortcut);

  // Add global listener if this is the first shortcut
  if (shortcuts.size === 1) {
    document.addEventListener("keydown", handleGlobalKeydown);
  }

  return id;
}

/**
 * Unregister a keyboard shortcut
 */
export function unregisterShortcut(id: string): void {
  shortcuts.delete(id);

  // Remove global listener if no shortcuts remain
  if (shortcuts.size === 0) {
    document.removeEventListener("keydown", handleGlobalKeydown);
  }
}

/**
 * Get all registered shortcuts
 */
export function getShortcuts(): RegisteredShortcut[] {
  return Array.from(shortcuts.values());
}

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: string): RegisteredShortcut[] {
  return Array.from(shortcuts.values()).filter((s) => s.category === category);
}

/**
 * Enable or disable a shortcut
 */
export function toggleShortcut(id: string, enabled?: boolean): void {
  const shortcut = shortcuts.get(id);
  if (shortcut) {
    shortcut.enabled = enabled ?? !shortcut.enabled;
  }
}

/**
 * Main keyboard shortcuts composable
 */
export function useKeyboardShortcuts() {
  const registeredShortcuts = new Set<string>();

  const register = (
    keyCombo: string | KeyCombo,
    callback: (event: KeyboardEvent) => void,
    options: ShortcutOptions = {}
  ): string => {
    const id = registerShortcut(keyCombo, callback, options);
    registeredShortcuts.add(id);
    return id;
  };

  const unregister = (id: string): void => {
    unregisterShortcut(id);
    registeredShortcuts.delete(id);
  };

  // Cleanup on unmount
  onUnmounted(() => {
    registeredShortcuts.forEach((id) => unregisterShortcut(id));
    registeredShortcuts.clear();
  });

  return {
    register,
    unregister,
    toggle: toggleShortcut,
    getAll: getShortcuts,
    getByCategory: getShortcutsByCategory,
  };
}

/**
 * Form-specific keyboard shortcuts composable
 */
export function useFormKeyboard(options: FormHandlerOptions = {}) {
  const shortcuts = useKeyboardShortcuts();
  const registeredIds: string[] = [];

  onMounted(() => {
    // Register form-specific shortcuts
    if (options.onSubmit) {
      const submitId = shortcuts.register(
        "ctrl+enter",
        (event) => options.onSubmit?.(event),
        {
          description: "Submit form",
          category: "form",
          allowInInput: true,
          preventDefault: true,
        }
      );
      registeredIds.push(submitId);
    }

    if (options.onCancel) {
      const cancelId = shortcuts.register(
        "escape",
        (event) => options.onCancel?.(event),
        {
          description: "Cancel form",
          category: "form",
          allowInInput: true,
          preventDefault: true,
        }
      );
      registeredIds.push(cancelId);
    }

    if (options.onClear) {
      const clearId = shortcuts.register(
        "ctrl+shift+x",
        (event) => options.onClear?.(event),
        {
          description: "Clear form",
          category: "form",
          allowInInput: true,
          preventDefault: true,
        }
      );
      registeredIds.push(clearId);
    }
  });

  onUnmounted(() => {
    registeredIds.forEach((id) => shortcuts.unregister(id));
  });

  return {
    // Expose shortcut management
    addShortcut: shortcuts.register,
    removeShortcut: shortcuts.unregister,
    toggleShortcut: shortcuts.toggle,
  };
}

/**
 * Task-specific keyboard shortcuts
 */
export function useTaskKeyboard(
  callbacks: {
    onToggleComplete?: (event: KeyboardEvent) => void;
    onDelete?: (event: KeyboardEvent) => void;
    onEdit?: (event: KeyboardEvent) => void;
    onDuplicate?: (event: KeyboardEvent) => void;
  } = {}
) {
  const shortcuts = useKeyboardShortcuts();
  const registeredIds: string[] = [];

  onMounted(() => {
    if (callbacks.onToggleComplete) {
      const toggleId = shortcuts.register("space", callbacks.onToggleComplete, {
        description: "Toggle task completion",
        category: "task",
        preventDefault: true,
      });
      registeredIds.push(toggleId);
    }

    if (callbacks.onDelete) {
      const deleteId = shortcuts.register("delete", callbacks.onDelete, {
        description: "Delete task",
        category: "task",
        preventDefault: true,
      });
      registeredIds.push(deleteId);
    }

    if (callbacks.onEdit) {
      const editId = shortcuts.register("enter", callbacks.onEdit, {
        description: "Edit task",
        category: "task",
        preventDefault: true,
      });
      registeredIds.push(editId);
    }

    if (callbacks.onDuplicate) {
      const duplicateId = shortcuts.register("ctrl+d", callbacks.onDuplicate, {
        description: "Duplicate task",
        category: "task",
        preventDefault: true,
      });
      registeredIds.push(duplicateId);
    }
  });

  onUnmounted(() => {
    registeredIds.forEach((id) => shortcuts.unregister(id));
  });

  return {
    addShortcut: shortcuts.register,
    removeShortcut: shortcuts.unregister,
  };
}

/**
 * Navigation keyboard shortcuts
 */
export function useNavigationKeyboard(
  callbacks: {
    onNext?: (event: KeyboardEvent) => void;
    onPrevious?: (event: KeyboardEvent) => void;
    onFirst?: (event: KeyboardEvent) => void;
    onLast?: (event: KeyboardEvent) => void;
    onFocus?: (event: KeyboardEvent) => void;
  } = {}
) {
  const shortcuts = useKeyboardShortcuts();
  const registeredIds: string[] = [];

  onMounted(() => {
    if (callbacks.onNext) {
      const nextId = shortcuts.register("arrowdown", callbacks.onNext, {
        description: "Navigate to next item",
        category: "navigation",
        preventDefault: true,
      });
      registeredIds.push(nextId);
    }

    if (callbacks.onPrevious) {
      const prevId = shortcuts.register("arrowup", callbacks.onPrevious, {
        description: "Navigate to previous item",
        category: "navigation",
        preventDefault: true,
      });
      registeredIds.push(prevId);
    }

    if (callbacks.onFirst) {
      const firstId = shortcuts.register("home", callbacks.onFirst, {
        description: "Navigate to first item",
        category: "navigation",
        preventDefault: true,
      });
      registeredIds.push(firstId);
    }

    if (callbacks.onLast) {
      const lastId = shortcuts.register("end", callbacks.onLast, {
        description: "Navigate to last item",
        category: "navigation",
        preventDefault: true,
      });
      registeredIds.push(lastId);
    }

    if (callbacks.onFocus) {
      const focusId = shortcuts.register("ctrl+f", callbacks.onFocus, {
        description: "Focus search/input",
        category: "navigation",
        preventDefault: true,
      });
      registeredIds.push(focusId);
    }
  });

  onUnmounted(() => {
    registeredIds.forEach((id) => shortcuts.unregister(id));
  });

  return {
    addShortcut: shortcuts.register,
    removeShortcut: shortcuts.unregister,
  };
}
