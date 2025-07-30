<!-- 
  ORGANISM: Task Summary Component
  Displays task statistics and summary information using Tailwind utilities
-->
<template>
  <div
    :class="[
      'theme-summary-card border rounded-lg shadow-sm transition-all duration-300 p-6 sm:p-4 md:p-8',
      totalTasks === 0 ? 'opacity-0 translate-y-2 pointer-events-none' : '',
    ]"
  >
    <div
      class="flex items-center justify-center gap-4 sm:gap-3 md:gap-6 mb-4 sm:mb-3 md:mb-6"
    >
      <div class="flex flex-col items-center gap-1">
        <span
          class="text-2xl sm:text-xl md:text-3xl font-semibold leading-none theme-summary-number"
          >{{ totalTasks }}</span
        >
        <span
          class="text-sm sm:text-xs md:text-base theme-summary-label uppercase tracking-wider"
        >
          {{ totalTasks === 1 ? "Task" : "Tasks" }}
        </span>
      </div>

      <div class="theme-summary-separator font-bold select-none">•</div>

      <div class="flex flex-col items-center gap-1">
        <span
          class="text-2xl sm:text-xl md:text-3xl font-semibold leading-none theme-summary-number-completed"
        >
          {{ completedTasks }}
        </span>
        <span
          class="text-sm sm:text-xs md:text-base theme-summary-label uppercase tracking-wider"
          >Completed</span
        >
      </div>

      <div class="theme-summary-separator font-bold select-none">•</div>

      <div class="flex flex-col items-center gap-1">
        <span
          class="text-2xl sm:text-xl md:text-3xl font-semibold leading-none theme-summary-number-pending"
        >
          {{ pendingTasks }}
        </span>
        <span
          class="text-sm sm:text-xs md:text-base theme-summary-label uppercase tracking-wider"
          >Pending</span
        >
      </div>
    </div>

    <!-- Progress bar -->
    <div
      v-if="totalTasks > 0"
      class="flex items-center gap-3 sm:flex-col sm:gap-2 mb-4 sm:mb-3 md:mb-6"
    >
      <div
        class="flex-1 sm:w-full h-2 theme-summary-progress-bg rounded-lg overflow-hidden"
      >
        <div
          class="h-full theme-summary-progress-fill rounded-lg transition-all duration-700 ease-out animate-[progress-fill_0.7s_ease-out]"
          :style="{ width: `${completionPercentage}%` }"
        ></div>
      </div>
      <span
        class="text-sm font-medium theme-summary-progress-text min-w-16 text-right sm:text-center sm:min-w-0"
      >
        {{ completionPercentage }}% complete
      </span>
    </div>

    <!-- Motivational message -->
    <div
      v-if="motivationalMessage"
      class="text-center text-sm sm:text-xs md:text-base font-medium p-2 px-4 sm:p-2 sm:px-3 theme-summary-message rounded-md animate-[message-appear_0.3s_ease-out]"
    >
      {{ motivationalMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props definition
const props = defineProps({
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

// Computed properties
const completionPercentage = computed(() => {
  if (props.totalTasks === 0) return 0;
  return Math.round((props.completedTasks / props.totalTasks) * 100);
});

const motivationalMessage = computed(() => {
  if (props.totalTasks === 0) return "";

  const percentage = completionPercentage.value;

  if (percentage === 100) {
    return "🎉 Amazing! All tasks completed!";
  } else if (percentage >= 75) {
    return "🔥 Almost there! Keep going!";
  } else if (percentage >= 50) {
    return "💪 Great progress! You're halfway done!";
  } else if (percentage >= 25) {
    return "🚀 Nice start! Keep up the momentum!";
  } else if (props.completedTasks > 0) {
    return "✨ Good job getting started!";
  } else {
    return "📝 Ready to tackle your tasks?";
  }
});
</script>

<style scoped>
/* Animations */
@keyframes progress-fill {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .duration-300,
  .duration-700,
  .transition-all,
  .animate-\[progress-fill_0\.7s_ease-out\],
  .animate-\[message-appear_0\.3s_ease-out\] {
    animation: none;
    transition: none;
  }
}
</style>
