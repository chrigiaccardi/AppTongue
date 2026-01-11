const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
module.exports = {
    entry: "./js/script.js",
     output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
    },
    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        })
    ],
module: {
    rules: [
        {
            test: /\.scss$/i,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
        },
        {
            test: /\.css$/i,
            use: [
                "style.loader",
                "css-loader"
            ]
        }
  ]      
    },
 devServer: {
    static: "./dist",
    port: 8080,
    open: true
  }
}