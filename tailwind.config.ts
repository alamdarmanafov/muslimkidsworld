import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B1B2B",
        moon: "#F4C95D",
        teal: "#0E7C7B",
        sand: "#FBF6EC",
      },
      fontFamily: {
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};
export default config;
