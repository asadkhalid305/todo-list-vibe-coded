# Development Guide - Vue 3 TypeScript Todo App 🚀

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [TypeScript Development](#typescript-development)
- [Project Structure](#project-structure)
- [Branching Strategy](#branching-strategy)
- [Development Guidelines](#development-guidelines)
- [Styling Guide](#styling-guide)
- [Component Architecture](#component-architecture)
- [Deployment](#deployment)

## 🚀 Quick Start

### Environment Setup

```bash
# Prerequisites
node --version  # v18 or higher
npm --version   # v8 or higher

# Clone and setup
git clone <repository-url>
cd todo-app-with-ai
npm install

# Development
npm run dev         # Start dev server (usually http://localhost:3001)
npm run type-check  # Run TypeScript type checking
npm run build       # Type check + build for production
npm run preview     # Preview production build
```

### Development Commands

```bash
# TypeScript commands
npm run type-check  # Run type checking without building
npm run build      # Type check + build for production

# Install new dependencies
npm install package-name
npm install -D dev-package-name

# Check for updates
npm outdated
```

## 📝 TypeScript Development

### Type Safety Requirements

This project maintains **100% TypeScript coverage**. All new code must:

- ✅ **Use TypeScript** - No JavaScript files in `src/` directory
- ✅ **Define proper interfaces** for component props and emits
- ✅ **Type composable returns** with explicit return types
- ✅ **Pass type checking** - `npm run type-check` must succeed
- ✅ **Follow type conventions** - Use existing patterns in `src/types/`

### Working with Types

```typescript
// Component Props & Emits
interface Props {
  tasks: Task[];
  currentFilter: FilterType;
}

interface Emits {
  (e: "filter-change", filter: FilterType): void;
  (e: "task-toggle", taskId: number): void;
}

// Composable with typed return
export function useTaskFilter(tasks: Ref<Task[]>) {
  const filteredTasks = computed((): Task[] => {
    // Implementation
  });

  return {
    filteredTasks,
  } as const;
}
```

### Type Organization

- **`src/types/components.ts`** - Component prop/emit interfaces
- **`src/types/task.ts`** - Task-related types and interfaces
- **`src/types/filter.ts`** - Filter types and enums
- **`src/types/theme.ts`** - Theme and styling types
- **`src/types/index.ts`** - Re-exports for easy importing

## 🌿 Branching Strategy

This project uses a **GitFlow-inspired strategy** for clean development:

### Branch Overview

```
main (production)     ──●──●──●── (auto-deploy)
                        /  /  /
develop (integration) ●──●──●──●── (CI/CD tests)
                      │
feature/* (optional)  ●──●──
```

### Workflow

1. **Development**: Work on `develop` branch
2. **Feature branches**: Optional for complex features
3. **Pull Requests**: `develop` → `main` for releases
4. **Deployment**: Automatic from `main` to GitHub Pages

### Commands

```bash
# Start new work
git checkout develop
git pull origin develop

# Feature development (optional)
git checkout -b feature/new-feature
# ... work ...
git checkout develop
git merge feature/new-feature

# Release to production
git checkout main
git merge develop
git push origin main  # Triggers deployment
```

npm update

# Clean install

rm -rf node_modules package-lock.json
npm install

```

## 📁 Project Structure

```

todo-app-with-ai/
├── .github/
│ └── workflows/
│ └── deploy.yml # CI/CD GitHub Actions
├── public/ # Static assets
├── src/
│ ├── components/ # Vue components (Atomic Design + TypeScript)
│ │ ├── atoms/ # Base components (.vue with TypeScript)
│ │ ├── molecules/ # Simple combinations (.vue with TypeScript)
│ │ ├── organisms/ # Complex components (.vue with TypeScript)
│ │ └── templates/ # Layout templates (.vue with TypeScript)
│ ├── composables/ # Vue composables (.ts files)
│ ├── types/ # TypeScript type definitions
│ │ ├── components.ts # Component prop/emit interfaces
│ │ ├── task.ts # Task-related types
│ │ ├── filter.ts # Filter types
│ │ ├── theme.ts # Theme types
│ │ └── index.ts # Type exports
│ ├── styles/ # SCSS and styling
│ │ ├── main.scss # Main entry point
│ │ └── scss/ # Theme files
│ ├── App.vue # Root component (TypeScript)
│ └── main.ts # App entry point (TypeScript)
├── index.html # HTML template
├── package.json # Dependencies & scripts
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json # TypeScript configuration
├── vite.config.js # Vite configuration
└── README.md # Documentation

```

### File Naming Conventions

- **Vue Components**: PascalCase (e.g., `BaseButton.vue`, `TaskForm.vue`)
- **TypeScript Files**: camelCase (e.g., `useTasks.ts`, `useTheme.ts`)
- **Type Files**: camelCase (e.g., `components.ts`, `task.ts`)
- **CSS/SCSS Files**: kebab-case (e.g., `main.scss`, `theme-variables.scss`)

## 🛠️ Development Guidelines

### Component Creation

1. **Determine Atomic Level**

```

Atoms: BaseButton, BaseInput, BaseCheckbox
Molecules: TaskItem, TaskForm, FilterTabs
Organisms: TaskList, TaskSummary
Templates: TodoLayout

````

2. **TypeScript Component Template**

```vue
<!--
  ATOM/MOLECULE/ORGANISM: Component Name
  Brief description of component purpose
-->
<template>
  <!-- Component HTML with Tailwind classes -->
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { SomeType } from "@/types/domain";

// Props interface
interface Props {
  prop1: string;
  prop2?: number;
}

// Emits interface
interface Emits {
  (e: 'event-name', value: string): void;
}

// Define props and emits
const props = withDefaults(defineProps<Props>(), {
  prop2: 0
});

const emit = defineEmits<Emits>();

// Reactive data with proper typing
const someValue = ref<string>('');

// Computed properties with inferred types
const computedValue = computed((): string => {
  return props.prop1.toUpperCase();
});

// Methods with explicit return types
const handleClick = (): void => {
  emit('event-name', someValue.value);
};
</script>

<style scoped>
/* Component-specific styles */
</style>
````

3. **Type Definition Pattern**

   ```typescript
   // In src/types/components.ts
   export interface ComponentNameProps {
     prop1: string;
     prop2?: number;
   }

   export interface ComponentNameEmits {
     (e: "event-name", value: string): void;
   }
   ```

   },
   };
   </script>

   <style scoped lang="scss">
   /* Only when Tailwind utilities aren't sufficient */
   </style>

   ```

   ```

### Code Style

- Use **Vue 3 Composition API** for all new components
- Follow **camelCase** for JavaScript, **kebab-case** for HTML attributes
- Use **TypeScript-style** prop definitions with validation
- Include **ARIA labels** for accessibility
- Add **component comments** explaining purpose

## 🎨 Styling Guide

### Priority Order

1. **Tailwind Utilities First**

   ```vue
   <div class="flex items-center justify-between p-4 bg-white">
   ```

2. **Theme Utilities for States**

   ```vue
   <input class="theme-input-normal focus:theme-input-focus">
   ```

3. **Custom SCSS When Needed**
   ```scss
   .complex-animation {
     @keyframes slideIn {
       from {
         transform: translateX(-100%);
       }
       to {
         transform: translateX(0);
       }
     }
   }
   ```

### Responsive Design

```vue
<!-- Mobile First: Base classes for mobile -->
<div class="p-4 text-sm">
  <!-- Small screens and up -->
  <div class="sm:p-6 sm:text-base">
    <!-- Medium screens and up -->
    <div class="md:p-8 md:text-lg">
      <!-- Large screens and up -->
      <div class="lg:p-12 lg:text-xl">
        Content
      </div>
    </div>
  </div>
</div>
```

### Theme Variables

```scss
// Use CSS custom properties for theme-aware colors
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

## 🏗️ Component Architecture

### State Management

```javascript
// App.vue - Main state
const tasks = ref([]);
const filter = ref("all");

// Child components - Props/events
props: ["tasks", "filter"];
emit("update:tasks", newTasks);
```

### Event Handling

```vue
<!-- Parent -->
<TaskForm @task-added="handleTaskAdded" />

<!-- Child -->
<script>
setup(props, { emit }) {
  const addTask = (task) => {
    emit('task-added', task)
  }
}
</script>
```

### Accessibility

```vue
<template>
  <button
    :aria-label="isComplete ? 'Mark as incomplete' : 'Mark as complete'"
    :aria-pressed="isComplete"
    @click="toggleComplete"
    @keydown.enter="toggleComplete"
    @keydown.space.prevent="toggleComplete"
  >
    <!-- Content -->
  </button>
</template>
```

## 🚀 Deployment

### Build Process

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Files output to dist/ directory
```

### Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test the production build locally
- [ ] Verify all environment variables are set
- [ ] Check responsive design on multiple devices
- [ ] Test dark/light mode switching
- [ ] Verify accessibility with screen reader
- [ ] Test localStorage functionality
- [ ] Check browser compatibility

### Environment Variables

```bash
# .env.production (if needed)
VITE_API_URL=https://api.production.com
VITE_ANALYTICS_ID=your-analytics-id
```

### Performance Considerations

- **Tailwind CSS**: Automatically purges unused styles
- **Vite**: Tree-shaking and code splitting
- **Vue 3**: Optimized reactivity system
- **localStorage**: Minimal data storage

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add new tasks
- [ ] Mark tasks complete/incomplete
- [ ] Delete tasks
- [ ] Filter tasks (All/Pending/Completed)
- [ ] Dark/light mode toggle
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Keyboard navigation
- [ ] localStorage persistence
- [ ] Cross-tab synchronization

### Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Additional Resources

- [Vue 3 Documentation](https://v3.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Happy coding! 🎉**
