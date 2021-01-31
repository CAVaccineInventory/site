module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "google",
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "ignorePatterns": ["**/*.min.js", "_site/**"],
  "rules": {
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never",
    }],
    "indent": ["error", 2, { "MemberExpression": 1, "SwitchCase": 1 }],
    "max-len": ["off"],
    "new-cap": ["error", { "newIsCapExceptions": ["autoComplete"] }],
    "object-curly-spacing": ["error", "always"],
    "operator-linebreak": ["error", "after", { "overrides": { "?": "before", ":": "before" } }],
    "quotes": ["error", "double", { "avoidEscape": true }],
    "require-jsdoc": ["off"],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
    }],
  },
};
