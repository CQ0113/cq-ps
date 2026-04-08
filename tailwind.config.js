/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: "#0a0a0a",
        panel: "#111318",
        accent: "#3b82f6",
        accentSoft: "#7c3aed"
      },
      boxShadow: {
        neon: "0 0 24px rgba(59,130,246,0.35)"
      }
    }
  },
  plugins: []
};
