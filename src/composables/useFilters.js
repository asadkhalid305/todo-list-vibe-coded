/**
 * Filter Management Composable
 * Handles task filtering, search, and view state management
 */

import { ref, computed } from "vue";

export function useFilters(tasks) {
  // Reactive state
  const currentFilter = ref("all");
  const searchQuery = ref("");
  const sortBy = ref("created"); // 'created', 'updated', 'alphabetical', 'completion'
  const sortOrder = ref("asc"); // 'asc', 'desc'

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
    { value: "alphabetical", label: "Alphabetical" },
    { value: "completion", label: "Completion Status" },
  ];

  // Filter tasks by completion status
  const filterByStatus = (tasks, filter) => {
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
  const filterBySearch = (tasks, query) => {
    if (!query.trim()) return tasks;

    const searchTerm = query.toLowerCase().trim();
    return tasks.filter((task) => task.text.toLowerCase().includes(searchTerm));
  };

  // Sort tasks
  const sortTasks = (tasks, sortBy, sortOrder) => {
    const sorted = [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "alphabetical":
          comparison = a.text.localeCompare(b.text);
          break;
        case "updated":
          comparison =
            new Date(a.updatedAt || a.createdAt) -
            new Date(b.updatedAt || b.createdAt);
          break;
        case "completion":
          // Sort by completion status, then by creation date
          if (a.completed !== b.completed) {
            comparison = a.completed ? 1 : -1;
          } else {
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
          }
          break;
        case "created":
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
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
  const setFilter = (filter) => {
    if (availableFilters.some((f) => f.value === filter)) {
      currentFilter.value = filter;
    }
  };

  const setSearch = (query) => {
    searchQuery.value = query;
  };

  const clearSearch = () => {
    searchQuery.value = "";
  };

  const setSorting = (sort, order = "asc") => {
    if (availableSortOptions.some((s) => s.value === sort)) {
      sortBy.value = sort;
      sortOrder.value = order;
    }
  };

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  };

  // Quick filter actions
  const showAll = () => setFilter("all");
  const showPending = () => setFilter("pending");
  const showCompleted = () => setFilter("completed");

  // Advanced filtering
  const filterByDateRange = (tasks, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= start && taskDate <= end;
    });
  };

  const filterByTextLength = (tasks, minLength = 0, maxLength = Infinity) => {
    return tasks.filter(
      (task) => task.text.length >= minLength && task.text.length <= maxLength
    );
  };

  // Get filter state for persistence
  const getFilterState = () => {
    return {
      currentFilter: currentFilter.value,
      searchQuery: searchQuery.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    };
  };

  // Restore filter state
  const restoreFilterState = (state) => {
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
