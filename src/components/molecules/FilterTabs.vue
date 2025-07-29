<!-- 
  MOLECULE: Filter Tabs Component
  Navigation tabs for filtering tasks (All, Pending, Completed)
-->
<template>
  <div class="filter-tabs" role="tablist" aria-label="Task filters">
    <button
      v-for="filter in filters"
      :key="filter.value"
      class="filter-tabs__tab"
      :class="{ 'filter-tabs__tab--active': currentFilter === filter.value }"
      role="tab"
      :aria-selected="currentFilter === filter.value"
      :aria-controls="`task-list-${filter.value}`"
      @click="selectFilter(filter.value)"
    >
      <span class="filter-tabs__label">{{ filter.label }}</span>
      <span v-if="filter.count !== undefined" class="filter-tabs__count">
        {{ filter.count }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props definition
const props = defineProps({
  currentFilter: {
    type: String,
    required: true,
    validator: (value) => ["all", "pending", "completed"].includes(value),
  },
  totalTasks: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  pendingTasks: {
    type: Number,
    default: 0,
  },
});

// Emits definition
const emit = defineEmits(["filter-change"]);

// Computed filters with counts
const filters = computed(() => [
  {
    value: "all",
    label: "All",
    count: props.totalTasks,
  },
  {
    value: "pending",
    label: "Pending",
    count: props.pendingTasks,
  },
  {
    value: "completed",
    label: "Completed",
    count: props.completedTasks,
  },
]);

// Methods
const selectFilter = (filterValue) => {
  if (filterValue !== props.currentFilter) {
    emit("filter-change", filterValue);
  }
};
</script>

<style scoped>
.filter-tabs {
  display: flex;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--space-1);
  gap: var(--space-1);
}

.filter-tabs__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  user-select: none;
  min-height: 40px;
}

.filter-tabs__tab:hover:not(.filter-tabs__tab--active) {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.filter-tabs__tab--active {
  background-color: var(--bg-secondary);
  color: var(--purple-600);
  box-shadow: var(--shadow-sm);
}

.filter-tabs__label {
  font-weight: 500;
}

.filter-tabs__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 var(--space-1);
  background-color: var(--slate-200);
  color: var(--slate-600);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.filter-tabs__tab--active .filter-tabs__count {
  background-color: var(--purple-600);
  color: var(--purple-50);
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .filter-tabs {
    padding: 2px;
  }

  .filter-tabs__tab {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
    min-height: 36px;
  }

  .filter-tabs__count {
    min-width: 1rem;
    height: 1rem;
    font-size: 0.6rem;
  }
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .filter-tabs__tab {
    padding: var(--space-3) var(--space-6);
    font-size: var(--font-size-base);
  }
}

/* Focus styles for accessibility */
.filter-tabs__tab:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .filter-tabs__tab,
  .filter-tabs__count {
    transition: none;
  }
}
</style>
