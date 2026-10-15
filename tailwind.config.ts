import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        "alin-gold": "var(--alin-gold)",
        "alin-gold-hover": "var(--alin-gold-hover)",
        "alin-gold-pressed": "var(--alin-gold-pressed)",
        "alin-black": "var(--alin-black)",
        "alin-near-black": "var(--alin-near-black)",
        "alin-graphite": "var(--alin-graphite)",
        "alin-white": "var(--alin-white)",
        "alin-muted": "var(--alin-text-muted-dark)",
        "alin-border": "var(--alin-border-dark)",
        "alin-success": "var(--alin-success)",
        "alin-warning": "var(--alin-warning)",
        "alin-danger": "var(--alin-danger)",
        "alin-info": "var(--alin-info)",
        background: "var(--alin-black)",
        foreground: "var(--alin-white)",
        border: "var(--alin-border-dark)",
        input: "var(--alin-border-dark)",
        ring: "var(--alin-gold)",
        primary: {
          DEFAULT: "var(--alin-gold)",
          foreground: "var(--alin-black)",
        },
        secondary: {
          DEFAULT: "var(--alin-near-black)",
          foreground: "var(--alin-white)",
        },
        muted: {
          DEFAULT: "var(--alin-near-black)",
          foreground: "var(--alin-text-muted-dark)",
        },
        accent: {
          DEFAULT: "var(--alin-gold)",
          foreground: "var(--alin-black)",
        },
        destructive: {
          DEFAULT: "var(--alin-danger)",
          foreground: "var(--alin-white)",
        },
        card: {
          DEFAULT: "var(--alin-near-black)",
          foreground: "var(--alin-white)",
        },
        popover: {
          DEFAULT: "var(--alin-near-black)",
          foreground: "var(--alin-white)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
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
  plugins: [animate],
};

export default config;
