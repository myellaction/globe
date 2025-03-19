'use strict';
//const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './assets/js/script.js',
  output: {
    filename: 'compiled_script.js',
    path: __dirname + '/assets/js/compiled'
  },
  watch: true,
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
                debug: true,
                corejs: 3,
                useBuiltIns: "usage"
            }]]
          }
        }
      }
    ]
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin()],
  // },
};
