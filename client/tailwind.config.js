// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */ // This line provides helpful type hints
module.exports = {
  content: [
    './index.html', // Scans the index.html file in client/
    './src/**/*.{js,ts,jsx,tsx}', // Scans all JS/TS/JSX/TSX files in client/src and its subdirectories
  ],
  theme: {
    extend: {
      colors: {
        // These map your Tailwind color names to your CSS variables defined in index.css
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Roblox-inspired colors mapped to their CSS variables
        'roblox-blue': 'var(--roblox-blue)',
        'roblox-dark': 'var(--roblox-dark)',
        'roblox-card': 'var(--roblox-card)',
        'roblox-orange': 'var(--roblox-orange)',
        'roblox-success': 'var(--roblox-success)',
        'roblox-error': 'var(--roblox-error)',
        'roblox-gray-400': 'var(--roblox-gray-400)',
        'roblox-gray-500': 'var(--roblox-gray-500)',
        'roblox-gray-600': 'var(--roblox-gray-600)',
        'roblox-gray-700': 'var(--roblox-gray-700)',
        'roblox-gray-800': 'var(--roblox-gray-800)',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate") // Ensure you have this installed if you use it
  ],
};
