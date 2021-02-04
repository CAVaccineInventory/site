const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = {
  "mode": "production",
  "entry": {
    "main": "./webpack/index.js",
    "airtable-autocomplete": "./webpack/airtable-autocomplete.js",
    "mapLoader": "./webpack/mapLoader.js",
    "nearest": "./webpack/nearest.js",
    "counties-autocomplete": "./webpack/counties-autocomplete.js",
    "county-page": "./webpack/county-page.js",
    "region": "./webpack/region.js",
  },
  "devtool": "source-map",
  "output": {
    "path": path.resolve(__dirname, "assets/js"),
    "publicPath": "",
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
  "plugins": [
    new WebpackManifestPlugin(),
  ],
};
