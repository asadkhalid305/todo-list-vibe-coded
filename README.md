# Vue 3 To-Do Application 🚀

A modern, responsive To-Do List application built with Vue 3 Composition API, Tailwind CSS, and SCSS. Features atomic design architecture, dark mode theming, and comprehensive accessibility support.

## ✨ Features

### Core Functionality

- ✅ **Add new tasks** with intuitive form interface
- ✅ **Mark tasks as complete** with animated checkboxes
- ✅ **Delete tasks** with confirmation interactions
- ✅ **Filter tasks** by All, Pending, and Completed states
- ✅ **Persistent storage** using localStorage
- ✅ **Task statistics** with progress tracking and motivational messages

### Design & UX

- 📱 **Mobile-first responsive design** (320px to 1440px+)
- 🎨 **Modern, clean UI** with Tailwind CSS utility classes
- 🌙 **Dark/Light mode toggle** with system preference detection
- ♿ **Full accessibility support** with ARIA labels, semantic HTML, and keyboard navigation
- 🎭 **Smooth animations** with respect for reduced motion preferences
- 📊 **Visual progress tracking** with animated progress bars
- 🎨 **Theme-aware styling** with CSS custom properties

### Technical Excellence

- 🏗️ **Atomic Design Architecture** for maximum reusability and maintainability
- 🔧 **Vue 3 Composition API** for clean, modern code organization
- 🎨 **Tailwind CSS + SCSS** hybrid approach for utility-first styling with theme customization
- 💾 **localStorage persistence** with cross-tab synchronization
- 🚀 **Performance optimized** with efficient re-rendering and Vite build system
- 📝 **TypeScript-ready** component structure
- 🧪 **Production-ready** code quality and error handling
- 🔄 **Hot Module Replacement** for instant development feedback

## 🏗️ Architecture

This application follows **Atomic Design** principles for scalable component architecture:

### 📁 Project Structure

```
src/
├── components/
│   ├── atoms/           # Basic building blocks
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseCheckbox.vue
│   │   └── DarkModeToggle.vue
│   ├── molecules/       # Simple component combinations
│   │   ├── TaskItem.vue
│   │   ├── TaskForm.vue
│   │   └── FilterTabs.vue
│   ├── organisms/       # Complex component combinations
│   │   ├── TaskList.vue
│   │   └── TaskSummary.vue
│   └── templates/       # Page-level layouts
│       └── TodoLayout.vue
├── composables/
│   └── useThemeClasses.js  # Theme utility composable
├── styles/
│   ├── main.scss           # Main SCSS entry point
│   └── scss/
│       ├── theme-variables.scss   # CSS custom properties
│       ├── theme-utilities.scss   # Theme utility classes
│       └── components.scss        # Component-specific styles
├── App.vue             # Root component with state management
└── main.js             # Application entry point
```

### 🧱 Component Hierarchy

```
App.vue (Page)
└── TodoLayout.vue (Template)
    ├── DarkModeToggle.vue (Atom) # Theme switcher
    ├── TaskForm.vue (Molecule)
    │   ├── BaseInput.vue (Atom)
    │   └── BaseButton.vue (Atom)
    ├── FilterTabs.vue (Molecule)
    │   └── BaseButton.vue (Atom)
    ├── TaskList.vue (Organism)
    │   └── TaskItem.vue (Molecule)
    │       ├── BaseCheckbox.vue (Atom)
    │       └── BaseButton.vue (Atom)
    └── TaskSummary.vue (Organism)
```

### 🎨 Styling Architecture

The application uses a **hybrid styling approach** combining the best of both worlds:

**Tailwind CSS:**

- Utility-first approach for rapid development
- Responsive design utilities (`sm:`, `md:`, `lg:`, `xl:`)
- Consistent spacing, colors, and typography scale
- Optimized bundle size with unused CSS purging

**SCSS + CSS Custom Properties:**

- Theme variables for dark/light mode switching
- Component-specific styling when utilities aren't sufficient
- CSS animations and keyframes
- Complex state-based styling

```scss
// Example: Theme-aware utilities
.theme-input-normal {
  @apply border-gray-300 bg-white text-gray-900;
  @apply dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100;
}
```

## 📱 Responsive Design

The application is built with a **mobile-first approach** using Tailwind CSS responsive utilities:

- **Mobile (320px - 639px)**: Single column layout, larger touch targets, optimized spacing
- **Tablet (640px - 1023px)**: Enhanced spacing, better typography hierarchy
- **Desktop (1024px+)**: Centered layout with maximum width, optimal information density

**Key Responsive Features:**

- Responsive container system with `container mx-auto max-w-4xl`
- Adaptive icon sizing: `w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4`
- Progressive spacing: `px-4 py-3 sm:px-6 md:px-8`
- Responsive typography scales

## ♿ Accessibility Features

- **Semantic HTML**: Proper use of headings, lists, forms, and landmarks
- **ARIA Support**: Comprehensive labeling, descriptions, and live regions
- **Keyboard Navigation**: Full keyboard accessibility with logical tab order
- **Screen Reader Support**: Descriptive text and status announcements
- **Dark Mode Support**: System preference detection with manual override
- **High Contrast**: Support for high contrast mode preference
- **Reduced Motion**: Respects user's motion sensitivity preferences
- **Focus Management**: Clear focus indicators and proper focus flow

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone or download** the project files
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:3001` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎨 Customization

### Theme Variables

The application uses CSS custom properties for theme switching between light and dark modes. Modify variables in `src/styles/scss/theme-variables.scss`:

```scss
:root {
  // Light mode colors
  --bg-primary: #f9fafb;
  --bg-secondary: #ffffff;
  --text-primary: #374151;
  --text-secondary: #6b7280;
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  // Dark mode colors
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --primary-color: #60a5fa;
  --success-color: #34d399;
  --danger-color: #f87171;
  --border-color: #475569;
}
```

### Tailwind Configuration

Customize Tailwind settings in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
  },
};
```

### Component Styling

Components use a hybrid approach:

- **Tailwind utilities** for layout, spacing, and common styles
- **SCSS theme utilities** for complex state-based styling
- **CSS custom properties** for theme-aware colors

## 🔧 Technical Details

### Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS + SCSS hybrid approach
- **Icons**: SVG icons with CSS animations
- **Storage**: localStorage with cross-tab synchronization
- **Architecture**: Atomic Design principles

### State Management

- **Reactive state** with Vue 3 Composition API
- **localStorage persistence** for data continuity
- **Cross-tab synchronization** for multi-window usage
- **Theme state management** with system preference detection

### Performance Optimizations

- **Computed properties** for efficient filtering and calculations
- **Transition groups** for smooth list animations
- **Event delegation** for optimal event handling
- **Lazy evaluation** of expensive operations
- **CSS-in-JS avoidance** for better performance
- **Tailwind purging** for minimal bundle size

### Error Handling

- **Input validation** with user-friendly error messages
- **localStorage fallbacks** for storage failures
- **Graceful degradation** for unsupported features
- **Theme fallbacks** for older browsers

## 🧪 Testing

The application is designed with testing in mind:

- **Component isolation** for unit testing
- **Clear event interfaces** for integration testing
- **Accessibility testing** hooks and landmarks
- **E2E testing** ready with semantic selectors

## 📈 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive enhancement** for older browsers

## 🤝 Contributing

The atomic design structure makes it easy to:

- **Add new atoms** for additional UI elements (buttons, inputs, toggles)
- **Compose new molecules** from existing atoms (forms, cards, navigation)
- **Create new organisms** by combining molecules (sections, layouts)
- **Build new templates** for different layouts (pages, modals)

### Development Guidelines

1. **Follow Atomic Design**: Place components in the correct atomic level
2. **Use Tailwind First**: Prefer utility classes over custom CSS
3. **Theme Variables**: Use CSS custom properties for color values
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Responsive**: Test across mobile, tablet, and desktop breakpoints

## 📝 License

MIT License - feel free to use this project for learning, development, or production.

---

**Built with ❤️ using Vue 3, Tailwind CSS, Vite, and modern web standards.**
