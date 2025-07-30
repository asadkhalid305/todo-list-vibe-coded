<!-- 
  MOLECULE: Filter Tabs Component
  Navigation tabs for filtering tasks (All, Pending, Completed) using Tailwind utilities
-->
<template>
  <div
    class="flex theme-filter-tabs rounded-lg p-1 gap-1"
    role="tablist"
    aria-label="Task filters"
  >
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        'flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-6 md:px-6 md:py-3 rounded-md border-none font-medium text-sm md:text-base cursor-pointer transition-all duration-200 select-none min-h-10 sm:min-h-9 focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-purple-600',
        currentFilter === filter.value
          ? 'theme-filter-tab-active shadow-sm active'
          : 'theme-filter-tab hover:theme-filter-tab:hover',
      ]"
      role="tab"
      :aria-selected="currentFilter === filter.value"
      :aria-controls="`task-list-${filter.value}`"
      @click="selectFilter(filter.value)"
    >
      <span class="font-medium">{{ filter.label }}</span>
      <span
        v-if="filter.count !== undefined"
        :class="[
          'inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-semibold rounded-lg transition-all duration-200 sm:min-w-4 sm:h-4 sm:text-xs',
          currentFilter === filter.value
            ? 'theme-filter-count-active'
            : 'theme-filter-count',
        ]"
      >
        {{ filter.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FilterTabsProps, FilterTabsEmits } from "@/types/components";
import type { FilterType } from "@/types/filter";

// Props definition with TypeScript
const props = withDefaults(defineProps<FilterTabsProps>(), {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
});

// Emits definition with TypeScript
const emit = defineEmits<FilterTabsEmits>();

// Computed filters with counts
const filters = computed(() => [
  {
    value: "all" as FilterType,
    label: "All",
    count: props.totalTasks,
  },
  {
    value: "pending" as FilterType,
    label: "Pending",
    count: props.pendingTasks,
  },
  {
    value: "completed" as FilterType,
    label: "Completed",
    count: props.completedTasks,
  },
]);

// Methods
const selectFilter = (filterValue: FilterType) => {
  if (filterValue !== props.currentFilter) {
    emit("filter-change", filterValue);
  }
};
</script>

<style scoped>
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .duration-200,
  .transition-all {
    transition: none;
  }
}
</style>
