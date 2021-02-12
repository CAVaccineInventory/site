const path = require("path");

module.exports = {
  "mode": "production",
  "entry": {
    "main": "./webpack/index.js",
    "airtable-autocomplete": "./webpack/airtable-autocomplete.js",
    "mapLoader": "./webpack/mapLoader.js",
    "nearest": "./webpack/nearest.js",
    "counties-autocomplete": "./webpack/counties-autocomplete.js",
    "county-page": "./webpack/county-page.js",
    "policies": "./webpack/policies.js",
  },
  "devtool": "source-map",
  "output": {
    "path": path.resolve(__dirname, "assets/js"),
    "environment": {
      "arrowFunction": false,
      "bigIntLiteral": false,
      "const": false,
      "destructuring": false,
      "dynamicImport": false,
      "forOf": false,
      "module": false,
    },
  },
  "module": {
    "rules": [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
      },
    ],
  },
  "resolve": {
    "fallback": {
      "url": require.resolve("url/"),
      "path": require.resolve("path-browserify"),
    },
  },
};
