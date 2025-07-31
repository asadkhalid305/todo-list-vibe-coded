/** @type {import('tailwindcss').Config} */
export default {
  // Scan these files for Tailwind classes
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  // Enable dark mode using data-theme attribute
  darkMode: ["class", '[data-theme="dark"]'],

  theme: {
    // Responsive breakpoints (mobile-first)
    screens: {
      sm: "640px", // Small devices (landscape phones)
      md: "768px", // Medium devices (tablets)
      lg: "1024px", // Large devices (desktops)
      xl: "1280px", // Extra large devices
      "2xl": "1536px", // 2K displays
    },

    // Container configuration for consistent layouts
    container: {
      center: true, // Center containers by default
      padding: {
        DEFAULT: "1rem", // Mobile padding
        sm: "1.5rem", // Small screens
        lg: "2rem", // Large screens
        xl: "2.5rem", // Extra large
        "2xl": "3rem", // 2K displays
      },
    },
    extend: {
      colors: {
        // Extend with your existing purple palette
        purple: {
          50: "#faf7ff",
          100: "#f3efff",
          200: "#e9e3ff",
          300: "#d4c7ff",
          400: "#b794ff",
          500: "#9333ea",
          600: "#7c2d92",
          700: "#6b1e7a",
          800: "#4c1d95",
          900: "#2e1065",
          950: "#1a0b3d",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        emerald: {
          50: "#ecfdf5",
          600: "#059669",
          700: "#047857",
        },
        red: {
          50: "#fef2f2",
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.75rem",
      },
      transitionDuration: {
        150: "150ms",
        250: "250ms",
        350: "350ms",
      },
      boxShadow: {
        "custom-sm": "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        "custom-md":
          "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)",
        "custom-lg":
          "0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
