/**
 * Composable for task statistics and analytics
 * Provides computed properties for task metrics, completion rates, and insights
 */

import { computed, ref } from "vue";
import type { Ref, ComputedRef } from "vue";
import type { Task, TaskStatistics } from "../types";

export const useTaskStatistics = (tasks: Ref<Task[]>) => {
  // Basic counts
  const totalTasks: ComputedRef<number> = computed(
    () => tasks.value?.length || 0
  );

  const completedTasks: ComputedRef<number> = computed(
    () => tasks.value?.filter((task) => task.completed).length || 0
  );

  const pendingTasks: ComputedRef<number> = computed(
    () => tasks.value?.filter((task) => !task.completed).length || 0
  );

  // Completion statistics
  const completionPercentage: ComputedRef<number> = computed(() => {
    if (totalTasks.value === 0) return 0;
    return Math.round((completedTasks.value / totalTasks.value) * 100);
  });

  const completionRate: ComputedRef<number> = computed(() => {
    if (totalTasks.value === 0) return 0;
    return +(completedTasks.value / totalTasks.value).toFixed(2);
  });

  // Progress categorization
  const progressCategory: ComputedRef<string> = computed(() => {
    const percentage = completionPercentage.value;

    if (percentage === 0) return "not-started";
    if (percentage < 25) return "getting-started";
    if (percentage < 50) return "making-progress";
    if (percentage < 75) return "halfway-there";
    if (percentage < 100) return "almost-done";
    return "completed";
  });

  // Motivational messages based on progress
  const motivationalMessages: Record<string, string[]> = {
    "not-started": [
      "📝 Ready to tackle your tasks?",
      "🚀 Let's get started!",
      "💪 Time to make things happen!",
      "✨ Your journey begins with the first task!",
    ],
    "getting-started": [
      "✨ Good job getting started!",
      "🌱 Great beginning! Keep the momentum!",
      "👏 You've taken the first step!",
      "🎯 Nice start! You're on your way!",
    ],
    "making-progress": [
      "🔥 You're building momentum!",
      "💪 Great progress! Keep it up!",
      "⚡ You're really getting things done!",
      "🎯 Fantastic work so far!",
    ],
    "halfway-there": [
      "💪 Great progress! You're halfway done!",
      "🔥 You're crushing it! Keep going!",
      "⭐ Excellent work! You're over the hump!",
      "🚀 Momentum is building! Don't stop now!",
    ],
    "almost-done": [
      "🔥 Almost there! Keep going!",
      "⚡ You're so close! Final push!",
      "🌟 Outstanding! Just a few more to go!",
      "💎 You're in the home stretch!",
    ],
    completed: [
      "🎉 Amazing! All tasks completed!",
      "🏆 Congratulations! Perfect completion!",
      "✨ Incredible! You did it all!",
      "🎊 Outstanding achievement!",
    ],
  };

  const motivationalMessage = computed(() => {
    if (totalTasks.value === 0) return "";

    const category = progressCategory.value;
    const messages = motivationalMessages[category] || [];

    // Use a simple hash of total tasks to get consistent but varied messages
    const messageIndex = totalTasks.value % messages.length;
    return messages[messageIndex] || messages[0];
  });

  // Productivity insights
  const productivityInsights = computed(() => {
    const insights = [];

    if (totalTasks.value === 0) {
      insights.push({
        type: "getting-started",
        icon: "🚀",
        message: "Add your first task to get started!",
      });
      return insights;
    }

    if (completionPercentage.value === 100) {
      insights.push({
        type: "achievement",
        icon: "🏆",
        message: "Perfect completion! You're crushing your goals!",
      });
    } else if (completionPercentage.value >= 80) {
      insights.push({
        type: "momentum",
        icon: "🔥",
        message: "You're on fire! Just a few more to go!",
      });
    } else if (
      pendingTasks.value > completedTasks.value &&
      completedTasks.value > 0
    ) {
      insights.push({
        type: "encouragement",
        icon: "💪",
        message: "Great start! Keep the momentum going!",
      });
    }

    if (totalTasks.value >= 10) {
      insights.push({
        type: "organization",
        icon: "📋",
        message: "Wow! You're managing a lot. Stay organized!",
      });
    }

    return insights;
  });

  // Task distribution analytics
  const taskDistribution = computed(() => ({
    completed: {
      count: completedTasks.value,
      percentage: completionPercentage.value,
    },
    pending: {
      count: pendingTasks.value,
      percentage:
        totalTasks.value > 0
          ? Math.round((pendingTasks.value / totalTasks.value) * 100)
          : 0,
    },
  }));

  // Performance metrics
  const performanceMetrics = computed(() => {
    const metrics: TaskStatistics & { rating: string; ratingIcon: string } = {
      totalTasks: totalTasks.value,
      completedTasks: completedTasks.value,
      pendingTasks: pendingTasks.value,
      completionRate: completionRate.value,
      completionPercentage: completionPercentage.value,
      progressCategory: progressCategory.value,
      rating: "getting-started",
      ratingIcon: "✨",
    };

    // Add performance rating
    if (completionPercentage.value === 100) {
      metrics.rating = "excellent";
      metrics.ratingIcon = "🌟";
    } else if (completionPercentage.value >= 75) {
      metrics.rating = "very-good";
      metrics.ratingIcon = "🔥";
    } else if (completionPercentage.value >= 50) {
      metrics.rating = "good";
      metrics.ratingIcon = "💪";
    } else if (completionPercentage.value >= 25) {
      metrics.rating = "fair";
      metrics.ratingIcon = "🚀";
    } else {
      metrics.rating = "getting-started";
      metrics.ratingIcon = "✨";
    }

    return metrics;
  });

  // Filter-specific statistics
  const getFilterStats = (filter: string): number => {
    if (filter === "all") return totalTasks.value;
    if (filter === "pending") return pendingTasks.value;
    if (filter === "completed") return completedTasks.value;
    return 0;
  };

  // Formatted statistics for display
  const formattedStats = computed(() => ({
    total: {
      count: totalTasks.value,
      label: totalTasks.value === 1 ? "Task" : "Tasks",
    },
    completed: {
      count: completedTasks.value,
      label: "Completed",
    },
    pending: {
      count: pendingTasks.value,
      label: "Pending",
    },
    percentage: {
      value: completionPercentage.value,
      label: "% Complete",
    },
  }));

  // Weekly/Daily patterns (if tasks have timestamps)
  const getTaskPatterns = () => {
    if (!tasks.value || tasks.value.length === 0) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(
      today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
    );

    const patterns = {
      todayCompleted: 0,
      thisWeekCompleted: 0,
      recentlyCompleted: 0,
    };

    tasks.value.forEach((task) => {
      if (task.completed && task.updatedAt) {
        const updatedDate = new Date(task.updatedAt);

        if (updatedDate >= today) {
          patterns.todayCompleted++;
        }

        if (updatedDate >= thisWeek) {
          patterns.thisWeekCompleted++;
        }

        // Recently completed (last 3 days)
        const threeDaysAgo = new Date(
          today.getTime() - 3 * 24 * 60 * 60 * 1000
        );
        if (updatedDate >= threeDaysAgo) {
          patterns.recentlyCompleted++;
        }
      }
    });

    return patterns;
  };

  return {
    // Basic counts
    totalTasks,
    completedTasks,
    pendingTasks,

    // Completion metrics
    completionPercentage,
    completionRate,
    progressCategory,

    // Messages and insights
    motivationalMessage,
    productivityInsights,

    // Analytics
    taskDistribution,
    performanceMetrics,
    formattedStats,

    // Helpers
    getFilterStats,
    getTaskPatterns,
  };
};

// Specialized hook for task summary components
export const useTaskSummary = (tasks: Ref<Task[]>) => {
  const stats = useTaskStatistics(tasks);

  const shouldShowSummary = computed(() => stats.totalTasks.value > 0);

  const summaryData = computed(() => ({
    totalTasks: stats.totalTasks.value,
    completedTasks: stats.completedTasks.value,
    pendingTasks: stats.pendingTasks.value,
    completionPercentage: stats.completionPercentage.value,
    motivationalMessage: stats.motivationalMessage.value,
    progressCategory: stats.progressCategory.value,
  }));

  return {
    ...stats,
    shouldShowSummary,
    summaryData,
  };
};
