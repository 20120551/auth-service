const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  devtool: "source-map",
  module: {
    rules: [
      {     
        test: /\.(ts)$/,
        loader: "ts-loader", 
        exclude: [
          [
            /node_modules/,
            /.serverless/,
            /.webpack/,
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      }
    ]
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map",
  },
  resolve: {
    extensions: [".mjs", ".json", ".ts", ".js"],
    alias: {
      configurations: path.resolve(__dirname, "src/configurations"),
      functions: path.resolve(__dirname, "src/functions"),
      guards: path.resolve(__dirname, "src/guards"),
      middleware: path.resolve(__dirname, "src/middleware"),
      modules: path.resolve(__dirname, "src/modules"),
      utils: path.resolve(__dirname, "src/utils"),
      interceptors: path.resolve(__dirname, "src/interceptors"),
    },
  },
}