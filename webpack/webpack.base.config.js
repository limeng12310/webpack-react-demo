const path = require('path');
const webpack = require('webpack');

const SRC_DIR = path.resolve(__dirname, '../src');
const DIST_DIR = path.resolve(__dirname, '../dist');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.less'], // 省略扩展名
    modules: [ // 用于查找模块的目录
      SRC_DIR,
      path.resolve(__dirname, '../node_modules')
    ],
    alias: { // 模块别名列表
      'src': SRC_DIR,
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [SRC_DIR],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: [SRC_DIR],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/cache-loader')
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          }
        ]
      },
      { // 小图片转换为base64
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:8].[ext]'
        },
      },
      {
        test: /\.(svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[hash:8].[ext]'
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:8].[ext]'
        },
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(), // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
    new webpack.ProvidePlugin({ // definitions定义标识符，当遇到指定标识符的时候，自动加载模块
      __: 'lodash',
      IMU: 'immutable'
    })
  ]
};
