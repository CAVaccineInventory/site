module.exports = {
  purge: {
    content: [
      "./**/*.html",
      "./**/*.md",
      "./**/*.yml",
      "./**/*.handlebars",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    padding: ["responsive"],
    margin: ["responsive"],
    inset: ["responsive"],
    borderRadius: ["responsive"],
    clear: ["responsive"],
    float: ["responsive"],
    textAlign: ["responsive"],
    space: ["responsive"],
    divide: ["responsive"],
    extend: {
    },
  },
  plugins: [
    require("tailwindcss-rtl"),
  ],
};
