/* eslint-disable @typescript-eslint/no-var-requires */
// const path = require("path");
// const nodeExternals = require("webpack-node-externals");

import path from "path";
import nodeExternals from "webpack-node-externals";

export default {
  target: "node",
  mode: "development",
  devtool: "source-map",
  entry: "./dist/index.js",
  externals: [nodeExternals()],
  output: {
    filename: "index.js",
    path: path.resolve(path.cwd(), "fn"),
    library: {
      type: "module",
    },
  },
};
