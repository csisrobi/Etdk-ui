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
        lightGray: "#E4E4E4",
        turquoise: "#99D4C9",
        yellow: "#FFCC45",
        darkGreen: "#0B4441",
        lightGreen: "#4D7C79",
        darkBrown: "#231F20",
        lightBrown: "#3C4247",
        beige: "#EBCE8F",
      },
    },
  },
  plugins: [],
};
