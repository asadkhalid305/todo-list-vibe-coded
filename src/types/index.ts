/**
 * Main Types Export
 * Central export file for all type definitions
 */

// Core types
export type * from './task';
export type * from './filter';
export type * from './theme';
export type * from './storage';

// UI and interaction types
export type * from './animation';
export type * from './validation';
export type * from './keyboard';
export type * from './statistics';

// Vue-specific types
export interface ComponentEmits {
  (event: 'update:modelValue', value: any): void;
  (event: 'submit', value: any): void;
  (event: 'cancel'): void;
  (event: 'change', value: any): void;
}

// Utility types
export type MaybeRef<T> = T | import('vue').Ref<T>;
export type MaybeReadonly<T> = T | Readonly<T>;

// Global app state type
export interface AppState {
  tasks: import('./task').Task[];
  nextTaskId: number;
  filters: import('./filter').FilterState;
  theme: import('./theme').ThemeInfo;
  ui: {
    isSubmitting: boolean;
    isLoading: boolean;
    errors: Record<string, string>;
  };
}
