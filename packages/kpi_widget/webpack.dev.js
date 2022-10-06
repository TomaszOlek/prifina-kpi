const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    entry: {
        main: path.resolve(__dirname, "./src") + "/index-dev.js",
      },
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3003,
    },
    output: {
        publicPath: "auto",
        clean: true,
    }

});