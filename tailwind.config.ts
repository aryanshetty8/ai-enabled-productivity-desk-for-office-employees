import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0faf0",
          100: "#d6f0d6",
          200: "#aadaaa",
          300: "#74bc74",
          400: "#4a9e4a",
          500: "#2e7d2e",
          600: "#236023",
          700: "#1a461a",
          800: "#122e12",
          900: "#0a1a0a"
        },
        khaki: "#c8b76a",
        bark: "#8b6914",
        surface: "#f7f8f2"
      },
      boxShadow: {
        panel: "0 18px 48px rgba(11, 32, 13, 0.08)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
