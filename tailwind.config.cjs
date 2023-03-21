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
      colors: {
        primary: colors.emerald,
        secondary: colors.emerald,
        dark: colors.gray,
        blue: {
          50: "#32d1ff",
          100: "#28c7ff",
          200: "#1ebdff",
          300: "#14b3ff",
          400: "#0aa9ff",
          500: "#009ffe",
          600: "#0095f4",
          700: "#008bea",
          800: "#0081e0",
          900: "#0077d6",
        },
        "bg-blue": {
          50: "#32d1ff",
          100: "#28c7ff",
          200: "#1ebdff",
          300: "#14b3ff",
          400: "#0aa9ff",
          500: "#009ffe",
          600: "#0095f4",
          700: "#008bea",
          800: "#0081e0",
          900: "#0077d6",
        },
        "breadcrumb-hero": "#222E50",
      },
    },
    fontFamily: {
      sans: ["Poppins", ...fontFamily.sans],
    },
  },
  plugins: [],
  darkMode: "class",
};
