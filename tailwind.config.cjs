/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      bebas: ["Bebas Neue"],
      calibri: ["Calibri"],
    },
    extend: {
      screens: {
        lg: "1100px",
      },
      colors: {
        gray: "#666766",
        lightcherry: "#542532",
        darkcherry: "#2A150F",
        lightGray: "#E4E4E4",
        yellow: "#FFCC45",
        lightBrown: "#3C4247",
        beige: "#EBCE8F",
        red: "#ED2024",
        application1: "#A58D90",
        application2: "#766561",
        application3: "#F4D99C",
      },
    },
  },
  plugins: [],
};
