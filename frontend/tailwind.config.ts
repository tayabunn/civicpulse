import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signal City Brand Tokens
        brand: {
          midnight: "#202B45",
          cobalt: {
            DEFAULT: "#315CFF",
            900: "#1735B8",
            700: "#244BE0",
            500: "#315CFF",
            400: "#6280FF",
            300: "#91A5FF",
            100: "#E8EDFF",
          },
          yellow: {
            DEFAULT: "#FFD447",
            700: "#B88700",
            500: "#FFD447",
            300: "#FFE58A",
            100: "#FFF7D6",
          },
          warmWhite: "#F7F5EF",
          coolGray: "#E2E5ED",
        },
        // Semantic Tokens
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          elevated: "var(--surface-elevated)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        sidebar: {
          bg: "var(--sidebar-bg)",
          text: "var(--sidebar-text)",
          active: "var(--sidebar-active)",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
