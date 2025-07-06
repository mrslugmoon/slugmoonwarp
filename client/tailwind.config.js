// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // IMPORTANT: Confirm this is present and correct!
  ],
  theme: {
    extend: {
      colors: {
        // This maps the Tailwind color 'border' to your CSS variable '--border'
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
        // Add your Roblox-inspired colors here as well if you want to use them directly as Tailwind classes
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
    require("tailwindcss-animate") // Example: If you use this
  ],
};
