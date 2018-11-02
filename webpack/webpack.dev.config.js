const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(__dirname, '../dist');
const { devEnv } = require('../config');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false, // https://webpack.js.org/loaders/css-loader/#modules
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              importLoaders: 2, // https://webpack.js.org/loaders/css-loader/#importloaders
            }
          },
          'postcss-loader',
          // https://github.com/ant-design/ant-design/issues/7927#issuecomment-372513256
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      }
    ]
  },
  // https://webpack.js.org/configuration/optimization
  optimization: {
    namedModules: true,
    noEmitOnErrors: true
  },
  plugins: [
    // 开启全局的模块热替换（HMR）
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      BASE_URL: '/'
    }),
    new webpack.DefinePlugin({
      'process.env': devEnv
    }),
    new FriendlyErrorsPlugin()
  ]
});
