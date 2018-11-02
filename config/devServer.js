const path = require('path');

exports.devServer = {
  host: '0.0.0.0',
  port: 8080,
  https: false,
  clientLogLevel: 'none',
  historyApiFallback: {
    disableDotRule: true
  },
  contentBase: path.join(__dirname, '../public'),
  watchContentBase: true,
  publicPath: '/',
  compress: false,
  hot: true,
  quiet: true,
  open: true,
  proxy: {
    // '/mis/commercial/campaign/': {
    //   target: 'http://10.96.88.94:9002',
    //   changeOrigin: true,
    // },
    // '/mis/commercial/material/': {
    //   target: 'http://10.95.120.61:8090',
    //   // target: 'http://10.96.88.94:9002',
    //   changeOrigin: true,
    // },
  }
};
