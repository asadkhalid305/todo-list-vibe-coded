/**
 * Statistics and Analytics Types
 */

import type { Task } from "./task";
import type { FilterType } from "./filter";

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  completionPercentage: number;
  progressCategory: string;
  rating?: string;
  ratingIcon?: string;
}

export interface ProductivityMetrics extends TaskStatistics {
  tasksCreatedToday: number;
  tasksCompletedToday: number;
  averageTasksPerDay: number;
  streakDays: number;
  longestStreak: number;
}

export interface TimeBasedStats {
  today: TaskStatistics;
  thisWeek: TaskStatistics;
  thisMonth: TaskStatistics;
  allTime: TaskStatistics;
}

export interface FilterStatistics {
  filter: FilterType;
  count: number;
  percentage: number;
  isActive: boolean;
}

export interface DateRangeStats {
  startDate: string;
  endDate: string;
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
}

export interface TaskSummary {
  recentTasks: Task[];
  upcomingTasks: Task[];
  overdueTasks: Task[];
  stats: TaskStatistics;
}
