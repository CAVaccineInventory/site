const path = require("path");
const webpack = require("webpack");

let publicPath = undefined;
if (process.env.NETLIFY) {
  // environment variables are documented at https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables
  const root = process.env.CONTEXT === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL;
  publicPath = `${root}/assets/js/`;
}

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
  "devtool": false,
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
  "plugins": [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
      publicPath,
    }),
  ],
};
