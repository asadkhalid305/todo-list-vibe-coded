/**
 * Keyboard Shortcuts and Interaction Types
 */

export interface KeyModifiers {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export interface KeyCombo {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export interface ShortcutOptions {
  description?: string;
  category?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  element?: Document | Element;
  enabled?: boolean;
}

export interface RegisteredShortcut extends ShortcutOptions {
  id: string;
  keyCombo: KeyCombo;
  callback: (event: KeyboardEvent) => void;
}

export interface ShortcutPreset {
  (callback: () => void): string;
}

export interface ShortcutPresets {
  addTask: ShortcutPreset;
  toggleTheme: ShortcutPreset;
  focusSearch: ShortcutPreset;
  showAll: ShortcutPreset;
  showPending: ShortcutPreset;
  showCompleted: ShortcutPreset;
  submitForm: ShortcutPreset;
  clearForm: ShortcutPreset;
  nextTask: ShortcutPreset;
  previousTask: ShortcutPreset;
  toggleComplete: ShortcutPreset;
  deleteTask: ShortcutPreset;
}

export interface ShortcutCategory {
  name: string;
  shortcuts: Array<{
    id: string;
    description: string;
    keyCombo: string;
  }>;
}

export interface FormShortcutOptions {
  onSubmit?: () => void;
  onCancel?: () => void;
  onClear?: () => void;
}

export interface InputKeyHandlers {
  onEnter?: (event: KeyboardEvent) => void;
  onEscape?: (event: KeyboardEvent) => void;
  onArrowUp?: (event: KeyboardEvent) => void;
  onArrowDown?: (event: KeyboardEvent) => void;
}
