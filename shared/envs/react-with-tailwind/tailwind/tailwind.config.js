module.exports = {
  content: ["**/*.{jsx,tsx,ts,js,html}"],
  theme: {
    extend: {
      letterSpacing: {
        wider: "0.07em",
      },
      lineHeight: {
        12: "3.5rem",
      },
      leading: {
        relaxed: "1.5",
      },
      boxShadow: {
        deep: "11px 20px 19px 0px rgba(0,0,0,0.53);",
        "deep-float": "8px 20px 24px 4px rgba(0,0,0,0.4)",
        "yellow-glow": "0px 0px 80px rgba(242, 169, 60, 0.30)",
        "green-glow": "0px 0px 80px rgba(116, 255, 140, 0.2)",
        "blue-glow": "0px 0px 80px rgba(41, 166, 243, 0.3);",
        "maroon-glow": "0px 0px 80px rgba(76, 23, 52, 0.5);",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: "#000",
        white: "#fff",
        blue: {
          500: "#29A6F3",
        },
        violet: {
          500: "#CE81F4",
        },
        yellow: {
          500: "#FEFF52",
        },
        green: {
          200: "#E7FE55",
          500: "#74FF8C",
        },
        purple: {
          400: "#CE81F4",
          500: "#907EFF",
        },
        teal: {
          500: "#7EFFE8",
        },
        orange: {
          500: "#F2A93C",
          900: "#3e2807",
        },
        gray: {
          400: "#B1AFBB",
          500: "#8D8B9B",
          600: "#252526",
          700: "#29292a",
          900: "#030301",
        },
        slate: {
          900: "#0c0c0d",
        },
        red: {
          800: "#4c1734",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/line-clamp")],
};
