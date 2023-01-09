const path = require("path");

const { DefinePlugin } = require("webpack");
const fs = require('fs');
const yaml = require('js-yaml');
const yamlText = fs.readFileSync('feedconf.yml', 'utf8')
const feedConf = JSON.stringify(yaml.load(yamlText));

module.exports = {
  mode: "development",
  target: "node",
  devtool: false,
  context: __dirname,
  entry: {
    main: path.resolve(__dirname, "src", "main.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
    libraryTarget: 'commonjs',
  },
  plugins: [
    new DefinePlugin({
      FEEDS: feedConf
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".js"],
  },
};
