/**
 * Core Task Types
 */

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  text: string;
}

export interface TaskUpdate {
  text?: string;
  completed?: boolean;
  updatedAt?: string;
}

export interface TaskCounts {
  all: number;
  total: number;
  completed: number;
  pending: number;
}

export interface TaskValidationResult {
  isValid: boolean;
  errors: string[];
}

export type TaskId = number;
export type TaskText = string;
