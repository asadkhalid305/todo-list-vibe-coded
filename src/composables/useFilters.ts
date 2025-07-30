/**
 * Filter Management Composable
 * Handles task filtering, search, and view state management
 */

import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import type {
  Task,
  FilterState,
  FilterType,
  SortBy,
  SortOrder,
} from "../types";

export function useFilters(tasks: Ref<Task[]>) {
  // Reactive state
  const currentFilter: Ref<FilterType> = ref("all");
  const searchQuery: Ref<string> = ref("");
  const sortBy: Ref<SortBy> = ref("created");
  const sortOrder: Ref<SortOrder> = ref("asc");

  // Available filters
  const availableFilters = [
    { value: "all", label: "All", icon: "📋" },
    { value: "pending", label: "Pending", icon: "⏳" },
    { value: "completed", label: "Completed", icon: "✅" },
  ];

  // Available sort options
  const availableSortOptions = [
    { value: "created", label: "Date Created" },
    { value: "updated", label: "Last Updated" },
    { value: "text", label: "Alphabetical" },
    { value: "status", label: "Completion Status" },
  ];

  // Filter tasks by completion status
  const filterByStatus = (tasks: Task[], filter: FilterType): Task[] => {
    switch (filter) {
      case "pending":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  // Filter tasks by search query
  const filterBySearch = (tasks: Task[], query: string): Task[] => {
    if (!query.trim()) return tasks;

    const searchTerm = query.toLowerCase().trim();
    return tasks.filter((task) => task.text.toLowerCase().includes(searchTerm));
  };

  // Sort tasks
  const sortTasks = (
    tasks: Task[],
    sortBy: SortBy,
    sortOrder: SortOrder
  ): Task[] => {
    const sorted = [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "updated":
          comparison =
            new Date(a.updatedAt || a.createdAt).getTime() -
            new Date(b.updatedAt || b.createdAt).getTime();
          break;
        case "text":
          comparison = a.text.localeCompare(b.text);
          break;
        case "status":
          if (a.completed !== b.completed) {
            comparison =
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          break;
        default: // created
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return sorted;
  };

  // Main filtered and sorted tasks computed property
  const filteredTasks = computed(() => {
    if (!tasks.value) return [];

    let result = [...tasks.value];

    // Apply status filter
    result = filterByStatus(result, currentFilter.value);

    // Apply search filter
    result = filterBySearch(result, searchQuery.value);

    // Apply sorting
    result = sortTasks(result, sortBy.value, sortOrder.value);

    return result;
  });

  // Task count statistics
  const taskCounts = computed(() => {
    if (!tasks.value) return { all: 0, pending: 0, completed: 0 };

    const allTasks = tasks.value;
    const pending = allTasks.filter((task) => !task.completed);
    const completed = allTasks.filter((task) => task.completed);

    return {
      all: allTasks.length,
      pending: pending.length,
      completed: completed.length,
    };
  });

  // Search results info
  const searchInfo = computed(() => {
    const hasQuery = searchQuery.value.trim().length > 0;
    const originalCount = filterByStatus(
      tasks.value || [],
      currentFilter.value
    ).length;
    const filteredCount = filteredTasks.value.length;

    return {
      hasQuery,
      query: searchQuery.value,
      originalCount,
      filteredCount,
      hasResults: filteredCount > 0,
      isFiltered: hasQuery && filteredCount !== originalCount,
    };
  });

  // Filter methods
  const setFilter = (filter: FilterType): void => {
    if (availableFilters.some((f) => f.value === filter)) {
      currentFilter.value = filter;
    }
  };

  const setSearch = (query: string): void => {
    searchQuery.value = query;
  };

  const clearSearch = (): void => {
    searchQuery.value = "";
  };

  const setSorting = (sort: SortBy, order: SortOrder = "asc"): void => {
    if (availableSortOptions.some((s) => s.value === sort)) {
      sortBy.value = sort;
      sortOrder.value = order;
    }
  };

  const toggleSortOrder = (): void => {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  };

  // Quick filter actions
  const showAll = (): void => setFilter("all");
  const showPending = (): void => setFilter("pending");
  const showCompleted = (): void => setFilter("completed");

  // Advanced filtering
  const filterByDateRange = (
    tasks: Task[],
    startDate: string | Date,
    endDate: string | Date
  ): Task[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return tasks.filter((task: Task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= start && taskDate <= end;
    });
  };

  const filterByTextLength = (
    tasks: Task[],
    minLength = 0,
    maxLength = Infinity
  ): Task[] => {
    return tasks.filter(
      (task: Task) =>
        task.text.length >= minLength && task.text.length <= maxLength
    );
  };

  // Get filter state for persistence
  const getFilterState = (): FilterState => {
    return {
      currentFilter: currentFilter.value,
      searchQuery: searchQuery.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    };
  };

  // Restore filter state
  const restoreFilterState = (state: FilterState): void => {
    if (state) {
      if (state.currentFilter) setFilter(state.currentFilter);
      if (state.searchQuery !== undefined) setSearch(state.searchQuery);
      if (state.sortBy) setSorting(state.sortBy, state.sortOrder);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    currentFilter.value = "all";
    searchQuery.value = "";
    sortBy.value = "created";
    sortOrder.value = "asc";
  };

  // Filter utilities
  const hasActiveFilters = computed(() => {
    return (
      currentFilter.value !== "all" ||
      searchQuery.value.trim() !== "" ||
      sortBy.value !== "created" ||
      sortOrder.value !== "asc"
    );
  });

  const getFilterDescription = computed(() => {
    const parts = [];

    if (currentFilter.value !== "all") {
      parts.push(`showing ${currentFilter.value} tasks`);
    }

    if (searchQuery.value.trim()) {
      parts.push(`searching for "${searchQuery.value}"`);
    }

    if (sortBy.value !== "created" || sortOrder.value !== "asc") {
      const sortLabel =
        availableSortOptions.find((s) => s.value === sortBy.value)?.label ||
        sortBy.value;
      parts.push(`sorted by ${sortLabel} (${sortOrder.value})`);
    }

    return parts.length > 0 ? parts.join(", ") : "showing all tasks";
  });

  return {
    // State
    currentFilter,
    searchQuery,
    sortBy,
    sortOrder,

    // Computed
    filteredTasks,
    taskCounts,
    searchInfo,
    hasActiveFilters,
    getFilterDescription,

    // Constants
    availableFilters,
    availableSortOptions,

    // Filter methods
    setFilter,
    setSearch,
    clearSearch,
    setSorting,
    toggleSortOrder,

    // Quick actions
    showAll,
    showPending,
    showCompleted,

    // Advanced filtering
    filterByDateRange,
    filterByTextLength,

    // State management
    getFilterState,
    restoreFilterState,
    resetFilters,

    // Utilities
    filterByStatus,
    filterBySearch,
    sortTasks,
  };
}
