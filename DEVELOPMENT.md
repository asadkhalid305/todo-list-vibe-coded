# Development Guide - Vue 3 Todo App 🚀

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Styling Guide](#styling-guide)
- [Component Architecture](#component-architecture)
- [Deployment](#deployment)

## 🚀 Quick Start

### Environment Setup

```bash
# Prerequisites
node --version  # v16 or higher
npm --version   # v8 or higher

# Clone and setup
git clone <repository-url>
cd todo-app-with-ai
npm install

# Development
npm run dev     # Start dev server (usually http://localhost:3001)
npm run build   # Build for production
npm run preview # Preview production build
```

### Development Commands

```bash
# Install new dependencies
npm install package-name
npm install -D dev-package-name

# Check for updates
npm outdated
npm update

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
todo-app-with-ai/
├── public/                 # Static assets
├── src/
│   ├── components/         # Vue components (Atomic Design)
│   │   ├── atoms/         # Base components
│   │   ├── molecules/     # Simple combinations
│   │   ├── organisms/     # Complex components
│   │   └── templates/     # Layout templates
│   ├── composables/       # Vue composables
│   ├── styles/           # SCSS and styling
│   │   ├── main.scss     # Main entry point
│   │   └── scss/         # Theme files
│   ├── App.vue           # Root component
│   └── main.js           # App entry point
├── index.html            # HTML template
├── package.json          # Dependencies & scripts
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md            # Documentation
```

## 🛠️ Development Guidelines

### Component Creation

1. **Determine Atomic Level**

   ```
   Atoms:      BaseButton, BaseInput, BaseCheckbox
   Molecules:  TaskItem, TaskForm, FilterTabs
   Organisms:  TaskList, TaskSummary
   Templates:  TodoLayout
   ```

2. **Component Template**

   ```vue
   <!-- 
     ATOM/MOLECULE/ORGANISM: Component Name
     Brief description of component purpose
   -->
   <template>
     <!-- Component HTML with Tailwind classes -->
   </template>

   <script>
   import { ref, computed } from "vue";

   export default {
     name: "ComponentName",
     props: {
       // Define props with validation
     },
     emits: ["event-name"],
     setup(props, { emit }) {
       // Composition API logic
       return {
         // Reactive data and methods
       };
     },
   };
   </script>

   <style scoped lang="scss">
   /* Only when Tailwind utilities aren't sufficient */
   </style>
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
