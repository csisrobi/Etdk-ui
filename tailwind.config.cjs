/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["Bebas Neue"],
        open: ["Open Sans"],
      },
      screens: {
        lg: "1100px",
      },
      colors: {
        grayCustom: "#666766",
        primaryLight: "#013333",
        primaryDark: "#052d2b",
        lightGray: "#E4E4E4",
        lightBrown: "#3C4247",
        beige: "#EBCE8F",
        application1: "#A58D90",
        application2: "#766561",
        application3: "#F4D99C",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};
