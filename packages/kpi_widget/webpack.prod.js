const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  entry: "./src/index",
  mode: "production",
  output: {
    //publicPath: "/mfe-app2/",
    publicPath: "auto",
    clean: true,
  },
  /*
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  */
});
