import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        mist: "var(--mist)",
        sand: "var(--sand)",
        sand2: "var(--sand2)",
        sage: "var(--sage)",
        sky: "var(--sky)",
        ink: "var(--ink)",
        ink2: "var(--ink2)",
        ink3: "var(--ink3)",
        line: "var(--line)",
        dusk: "var(--dusk)",
        verde: "var(--verde)",
        "verde-chiaro": "var(--verde-chiaro)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 60px -24px rgba(0,0,0,.18)",
        lift: "0 36px 80px -24px rgba(0,0,0,.28)",
        hero: "0 30px 70px -20px rgba(30,33,35,.35)",
      },
      borderRadius: { card: "28px", big: "36px", huge: "40px" },
      maxWidth: { page: "1280px" },
    },
  },
  plugins: [],
};
export default config;
