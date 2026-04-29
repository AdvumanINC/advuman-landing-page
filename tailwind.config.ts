import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#090909",
        accent: "#FFD200",
        muted: "#888888",
        typo: "#4A4A4A",
        line: "#333333",
      },
      fontFamily: {
        display: ["var(--font-display)", "Anton", "Impact", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.06em",
      },
      boxShadow: {
        glow: "0 0 30px rgba(255,210,0,0.45)",
        "glow-lg": "0 0 50px rgba(255,210,0,0.7)",
      },
      keyframes: {
        spin3d: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
