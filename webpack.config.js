// webpack.config.js
const path = require("path");
const slsw = require("serverless-webpack");
//const nodeExternals = require("webpack-node-externals");
const { IgnorePlugin } = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  //externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  stats: "minimal",
  devtool: "nosources-source-map",
  performance: {
    hints: false,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      Components: path.resolve(__dirname, "api/components"), // then use `import MyComponent from "Components/MyComponent.js"`
    },
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map",
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /cardinal/, // mysql2 compilation can't find cardinal in node_modules/mysql2/lib ...
    }),
    new Dotenv(),
  ]
};