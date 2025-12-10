import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7f13ec",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
        "surface-light": "#ffffff",
        "surface-dark": "#261933",
        "text-main-light": "#1a1122",
        "text-main-dark": "#ffffff",
        "text-sec-light": "#6b5c7b",
        "text-sec-dark": "#ad92c9",
        "border-light": "#e0dce6",
        "border-dark": "#362348",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
