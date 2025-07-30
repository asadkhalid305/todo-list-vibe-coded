/**
 * Filter and Search Types
 */

export type FilterType = 'all' | 'pending' | 'completed';

export type SortBy = 'created' | 'updated' | 'text' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  currentFilter: FilterType;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface FilterOptions {
  includeCompleted?: boolean;
  includePending?: boolean;
  searchFields?: string[];
  caseSensitive?: boolean;
}

export interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
}

export interface FilterStats {
  total: number;
  visible: number;
  filtered: number;
  percentage: number;
}

export interface AdvancedFilterOptions {
  dateRange?: DateRange;
  textLength?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
}
