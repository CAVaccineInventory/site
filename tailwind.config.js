module.exports = {
  purge: {
    enabled: true,
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
    extend: {},
  },
  plugins: [],
};
