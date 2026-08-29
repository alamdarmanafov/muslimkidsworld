import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101534",
        inkMuted: "#5B6178",
        primary: "#6C5DD3",
        primaryDark: "#5643C2",
        accent: "#8B7CF6",
        success: "#22C55E",
        gold: "#F4B740",
        surface: "#FAF9FE",
        border: "#ECEAF7",
        sidebar: "#12142B",
      },
    },
  },
  plugins: [],
};
export default config;
