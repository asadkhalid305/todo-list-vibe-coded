/**
 * Component Props and Types
 * Type definitions for Vue component props, emits, and related interfaces
 */

// Button Component Types
export type ButtonVariant = "primary" | "secondary" | "danger" | "success";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonType = "button" | "submit" | "reset";

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: ButtonType;
}

export interface BaseButtonEmits {
  click: [event: MouseEvent];
}

// Input Component Types
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url";

export interface BaseInputProps {
  modelValue?: string;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string | null; // Allow null to match validation composable
  label?: string;
  id?: string;
  name?: string;
  autocomplete?: string;
  maxlength?: number;
  minlength?: number;
  size?: ButtonSize; // Reusing ButtonSize as it's the same values
  ariaLabel?: string;
}

export interface BaseInputEmits {
  "update:modelValue": [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  input: [event: Event];
}

// Checkbox Component Types
export interface BaseCheckboxProps {
  modelValue?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  id?: string;
  name?: string;
  value?: string | number | boolean;
  ariaLabel?: string;
}

export interface BaseCheckboxEmits {
  "update:modelValue": [value: boolean];
  change: [event: Event];
}

// Dark Mode Toggle Component Types
export interface DarkModeToggleProps {
  modelValue?: boolean;
}

export interface DarkModeToggleEmits {
  "update:modelValue": [value: boolean];
}

// Task Item Component Types
import type { Task } from "./task";

export interface TaskItemProps {
  task: Task;
  isEditing?: boolean;
  showActions?: boolean;
}

export interface TaskItemEmits {
  "toggle-complete": [taskId: number];
  delete: [taskId: number];
  edit: [taskId: number];
  update: [taskId: number, text: string];
  "cancel-edit": [];
}

// Filter Tabs Component Types (for future use)
import type { FilterType } from "./filter";

export interface FilterTabsProps {
  currentFilter: FilterType;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface FilterTabsEmits {
  "filter-change": [filter: FilterType];
}

// Task Form Component Types (for future use)
export interface TaskFormProps {
  isSubmitting?: boolean;
}

export interface TaskFormEmits {
  "add-task": [text: string];
}
