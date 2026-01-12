const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: "./js/script.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  mode: "development",
  devtool: "source-map",
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new MiniCssExtractPlugin({ filename: 'style.css' })
  ],
  module: {
    rules: [
      // IMPORT SCSS IN JS -> IGNORATO (side-effect: processato da regola sotto)
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['ignore-loader? /\.scss$/']  // Ignora solo import SCSS
      },
      // PROCESSA SCSS files
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      // Babel per JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  devServer: {
    static: "./dist",
    port: 8080,
    open: true,
  },
};
