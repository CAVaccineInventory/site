const path = require("path");
const webpack = require("webpack");

let publicPath = undefined;
if (process.env.NETLIFY) {
  // environment variables are documented at https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables
  const root = process.env.CONTEXT === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL;
  publicPath = `${root}/assets/js/`;
}

module.exports = {
  "entry": {
    "counties-autocomplete": "./webpack/counties-autocomplete.js",
    "county-page": "./webpack/county-page.js",
    "embed": "./webpack/embed.js",
    "main": "./webpack/index.js",
    "mapLoader": "./webpack/mapLoader.js",
    "mobileMenu": "./webpack/mobileMenu.js",
    "nearest": "./webpack/nearest.js",
    "policies": "./webpack/policies.js",
    "providers": "./webpack/providers.js",
  },
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
        options: {
          helperDirs: [path.resolve(__dirname, "webpack/handlebars-helpers")],
        },
      },
    ],
  },
  "resolve": {
    "fallback": {
      "url": require.resolve("url/"),
      "path": require.resolve("path-browserify"),
    },
  },
  "resolveLoader": {
    modules: ["node_modules", path.resolve(__dirname, "webpack/loaders")],
  },
  "plugins": [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
      publicPath,
    }),
  ],
};
