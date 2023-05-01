const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      spacing: {
        80: "20rem",
        108: "27rem",
        160: "40rem",
      },
      // inset: ["group-hover"],
    },
    fontFamily: {
      sans: ["Poppins", ...fontFamily.sans],
    },
  },
  plugins: [],
  darkMode: "class",
};
