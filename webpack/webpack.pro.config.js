const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(__dirname, '../dist');
const { prodEnv, uglifyOptions } = require('../config');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: DIST_DIR,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '//static.udache.com/crosshairs/', // 最终上线地址
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false, // https://webpack.js.org/loaders/css-loader/#modules
              localIdentName: '[local]--[hash:base64:5]',
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
    minimize: true,
    minimizer: [
      new UglifyJsPlugin(uglifyOptions)
    ],
    // https://webpack.js.org/plugins/split-chunks-plugin
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': prodEnv
    }),
    new webpack.DllReferencePlugin({
      context: ROOT_PATH,
      manifest: require('../dist/vendor/vendor-manifest.json'),
      sourceType: 'var'
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
      algorithm: 'gzip',
      threshold: 1024
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
    // https://github.com/GoogleChromeLabs/preload-webpack-plugin
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.map$/]
    }),
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: 'asyncChunks'
    }),
    // https://webpack.js.org/plugins/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:8].css`,
      chunkFilename: 'css/[name].[id].[contenthash:8].css'
    }),
    // https://github.com/NMFR/optimize-css-assets-webpack-plugin
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { disable: true },
        mergeLonghand: false
      },
      canPrint: false
    }),
    new ManifestPlugin({
      publicPath: '/',
    }),
    // https://webpack.js.org/plugins/hashed-module-ids-plugin
    new webpack.HashedModuleIdsPlugin(),
    // new BundleAnalyzerPlugin()
  ]
});
