// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // THIS IS CRUCIAL: Tell Tailwind where your classes are used.
  content: [
    "./index.html", // If your main HTML file is in the client root
    "./src/**/*.{js,ts,jsx,tsx}", // All JS/TS/JSX/TSX files in src and its subdirectories
    // Add any other specific paths if you have components/files outside of src
    // e.g., "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // These map the Tailwind color names (e.g., 'border') to your CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Your custom Roblox theme colors (ensure these are also in your index.css :root/.dark blocks)
        "roblox-blue": "var(--roblox-blue)",
        "roblox-dark": "var(--roblox-dark)",
        "roblox-card": "var(--roblox-card)",
        "roblox-orange": "var(--roblox-orange)",
        "roblox-success": "var(--roblox-success)",
        "roblox-error": "var(--roblox-error)",
        "roblox-gray-400": "var(--roblox-gray-400)",
        "roblox-gray-500": "var(--roblox-gray-500)",
        "roblox-gray-600": "var(--roblox-gray-600)",
        "roblox-gray-700": "var(--roblox-gray-700)",
        "roblox-gray-800": "var(--roblox-gray-800)",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { transform: "translateY(0%)" },
          "20%,50%": { transform: "translateY(-70%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // If you're using 'tw-animate-css' make sure it's installed and included here:
    // require("tw-animate-css"),
  ],
};
