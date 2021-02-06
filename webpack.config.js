const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  "mode": "production",
  "plugins": [new MiniCssExtractPlugin()],
  "entry": {
    "main": "./webpack/index.js",
    "airtable-autocomplete": "./webpack/airtable-autocomplete.js",
    "mapLoader": "./webpack/mapLoader.js",
    "nearest": "./webpack/nearest.js",
    "counties-autocomplete": "./webpack/counties-autocomplete.js",
    "county-page": "./webpack/county-page.js",
    "region": "./webpack/region.js",
    "style": "./webpack/css/main.css",
  },
  "devtool": "source-map",
  "output": {
    "path": path.resolve(__dirname, "assets/"),
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
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-import",
                  "tailwindcss",
                  "autoprefixer",
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
