const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
   
const webpack = require("webpack");

const deps = require('./package.json').dependencies;
require('dotenv').config()

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
   
    new webpack.EnvironmentPlugin([ 'DEBUG','REACT_APP_ID']),
   
    new ModuleFederationPlugin({
      name: process.env.REACT_APP_ID,
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      shared: {
      'react': {
        import: 'react', // the "react" package will be used a provided and fallback module
        singleton: true, // only a single version of the shared module is allowed
        requiredVersion: deps.react
      },
      'react-dom/client': {
        import: 'react-dom/client', // the "react" package will be used a provided and fallback module
        singleton: true, // only a single version of the shared module is allowed
        requiredVersion: deps["react-dom"]
      },
       
          '@prifina/hooks-v2': {
              import: '@prifina/hooks-v2'
            }  
            
        }
      
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    
  ],
};
