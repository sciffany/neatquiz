// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: resolve("./dist"),
    filename: "[name].[hash].js",
  },
  devServer: {
    contentBase: "./dist",
  },
  resolve: {
    modules: ["test"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [new HtmlWebpackPlugin()],
};
