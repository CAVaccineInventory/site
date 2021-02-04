const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = (_env, args) => {
  const cfg = {
    "mode": args.mode || "development",
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

  if (cfg.mode === "production") {
    cfg.output.hashFunction = "sha256";
    cfg.output.filename = "[name].[contenthash].js";
  }

  return cfg;
};
