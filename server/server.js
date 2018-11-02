var path = require('path')
var webpack = require('webpack')
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const openBrowser = require('react-dev-utils/openBrowser');
const { prepareProxy, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');

const { mock, info, hasYarn } = require('./utils');
const { devServer } = require('../config');

let webpackConfig = require('../webpack/webpack.dev.config.js');

function addDevClientToEntry(config, devClient) {
  const { entry } = config;
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    Object.keys(entry).forEach((key) => {
      entry[key] = devClient.concat(entry[key]);
    })
  } else if (typeof entry === 'function') {
    config.entry = entry(devClient);
  } else {
    config.entry = devClient.concat(entry);
  }
}

async function server() {
  info('Starting development server...');

  const devClients = [
    require.resolve('react-dev-utils/webpackHotDevClient')
  ];
  // inject dev/hot client
  addDevClientToEntry(webpackConfig, devClients);

  const compiler = webpack(webpackConfig);

  const { https, host, port, open, before } = devServer;

  let proxySettings;

  devServer.proxy = undefined;
  devServer.before = mock(
    devServer,
    before,
    path.resolve(__dirname, '../mock'),
  );
  proxySettings = prepareProxy(
    devServer.proxy,
    path.resolve(__dirname, '../public'),
  );

  portfinder.basePort = port;

  const urls = prepareUrls(
    https ? 'https' : 'http',
    host,
    await portfinder.getPortPromise()
  );

  // create server
  const server = new WebpackDevServer(compiler, {
    ...devServer,
    proxy: proxySettings
  });

  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        process.exit(0);
      });
    });
  });

  return new Promise((resolve, reject) => {
    // log instructions & open browser on first compilation complete
    let isFirstCompile = true
    compiler.hooks.done.tap('dev-server', stats => {
      if (stats.hasErrors()) {
        return;
      }

      console.log();
      console.log([
        `  App running at: ❤️  ❤️  ️❤️`,
        `  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`,
        `  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}`
      ].join('\n'));
      console.log();

      if (isFirstCompile) {
        isFirstCompile = false;

        const buildCommand = hasYarn() ? `yarn build` : `npm run build`;
        console.log(`  Note that the development build is not optimized.`);
        console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`);
        console.log();

        if (open) {
          openBrowser(urls.localUrlForBrowser);
        }

        // resolve returned Promise
        // so other commands can do api.service.run('serve').then(...)
        resolve({
          server,
          url: urls.localUrlForBrowser
        });
      }
    })

    server.listen(port, host, err => {
      if (err) {
        reject(err);
      }
    });
  });
}

module.exports = server();
