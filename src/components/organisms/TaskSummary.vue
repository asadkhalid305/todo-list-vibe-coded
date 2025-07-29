<!-- 
  ORGANISM: Task Summary Component
  Displays task statistics and summary information
-->
<template>
  <div
    class="task-summary"
    :class="{ 'task-summary--hidden': totalTasks === 0 }"
  >
    <div class="task-summary__stats">
      <div class="task-summary__stat">
        <span class="task-summary__stat-number">{{ totalTasks }}</span>
        <span class="task-summary__stat-label">
          {{ totalTasks === 1 ? "Task" : "Tasks" }}
        </span>
      </div>

      <div class="task-summary__separator">•</div>

      <div class="task-summary__stat">
        <span
          class="task-summary__stat-number task-summary__stat-number--completed"
        >
          {{ completedTasks }}
        </span>
        <span class="task-summary__stat-label">Completed</span>
      </div>

      <div class="task-summary__separator">•</div>

      <div class="task-summary__stat">
        <span
          class="task-summary__stat-number task-summary__stat-number--pending"
        >
          {{ pendingTasks }}
        </span>
        <span class="task-summary__stat-label">Pending</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="totalTasks > 0" class="task-summary__progress">
      <div class="task-summary__progress-bar">
        <div
          class="task-summary__progress-fill"
          :style="{ width: `${completionPercentage}%` }"
        ></div>
      </div>
      <span class="task-summary__progress-text">
        {{ completionPercentage }}% complete
      </span>
    </div>

    <!-- Motivational message -->
    <div v-if="motivationalMessage" class="task-summary__message">
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
.task-summary {
  background-color: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.task-summary--hidden {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.task-summary__stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.task-summary__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.task-summary__stat-number {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-700);
  line-height: 1;
}

.task-summary__stat-number--completed {
  color: var(--success-color);
}

.task-summary__stat-number--pending {
  color: var(--primary-color);
}

.task-summary__stat-label {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.task-summary__separator {
  color: var(--gray-300);
  font-weight: bold;
  user-select: none;
}

.task-summary__progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.task-summary__progress-bar {
  flex: 1;
  height: 0.5rem;
  background-color: var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.task-summary__progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--success-color)
  );
  border-radius: var(--radius-lg);
  transition: width var(--transition-slow);
  animation: progress-fill var(--transition-slow) ease-out;
}

.task-summary__progress-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-600);
  min-width: 4rem;
  text-align: right;
}

.task-summary__message {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  font-weight: 500;
  padding: var(--space-2) var(--space-4);
  background-color: var(--gray-50);
  border-radius: var(--radius-md);
  animation: message-appear var(--transition-normal) ease-out;
}

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

/* Mobile optimizations */
@media (max-width: 639px) {
  .task-summary {
    padding: var(--space-4);
  }

  .task-summary__stats {
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .task-summary__stat-number {
    font-size: var(--font-size-xl);
  }

  .task-summary__stat-label {
    font-size: var(--font-size-xs);
  }

  .task-summary__progress {
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .task-summary__progress-text {
    text-align: center;
    min-width: auto;
  }

  .task-summary__message {
    font-size: var(--font-size-xs);
    padding: var(--space-2) var(--space-3);
  }
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .task-summary {
    padding: var(--space-8);
  }

  .task-summary__stats {
    gap: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .task-summary__stat-number {
    font-size: var(--font-size-3xl);
  }

  .task-summary__progress {
    margin-bottom: var(--space-6);
  }

  .task-summary__message {
    font-size: var(--font-size-base);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .task-summary,
  .task-summary__progress-fill,
  .task-summary__message {
    animation: none;
    transition: none;
  }
}
</style>
