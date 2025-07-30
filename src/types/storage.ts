/**
 * Storage and Persistence Types
 */

import type { Task } from './task';
import type { FilterState } from './filter';
import type { ThemeConfig } from './theme';

export interface StorageData {
  tasks: Task[];
  nextTaskId: number;
  filters?: FilterState;
  theme?: ThemeConfig;
  version?: string;
  lastUpdated?: string;
}

export interface StorageOptions {
  immediate?: boolean;
  deep?: boolean;
  debounce?: number;
}

export interface AutoSaveConfig extends StorageOptions {
  interval?: number;
  maxRetries?: number;
}

export interface ExportData extends StorageData {
  exportedAt: string;
  appVersion: string;
  format: 'json' | 'csv' | 'txt';
}

export interface ImportResult {
  success: boolean;
  tasksImported: number;
  errors: string[];
  warnings: string[];
}

export interface StorageEvent {
  key: string;
  oldValue: string | null;
  newValue: string | null;
  timestamp: number;
}

export type StorageEventHandler = (data: StorageData) => void;
export type CleanupFunction = () => void;
