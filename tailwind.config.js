/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.5rem",
        sm: "0.5rem",
        lg: "0.5rem",
        xl: "2rem",
        "2xl": "4rem",
      },
    },
    extend: {
      colors: {
        accent: "#be27ce33",
        primary: "#be27ce",
        secondary: "#F7F7F7",
      },
    },
  },
  plugins: [],
};
