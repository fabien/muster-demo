const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  performance: {
    // maxEntrypointSize: 512000,
    // maxAssetSize: 512000
  },
  entry: {
    app: [
      'babel-polyfill',
      './src/index.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'build'),
    filename: 'app.bundle.js',
    publicPath: 'build',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
           plugins: ['lodash'],
           presets: ['env', 'stage-0']
        }
    }]
  },
  plugins: [
    new LodashModuleReplacementPlugin({
        shorthands: true
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  }
}
