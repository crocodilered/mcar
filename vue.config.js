const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const PUBLIC_PATH = 'https://www.my-car.com/';

module.exports = {
  runtimeCompiler: true,

  css: {
    loaderOptions: {
      sass: {
        includePaths: ['./node_modules']
      }
    }
  },

  configureWebpack: {
    plugins: [
      new SWPrecacheWebpackPlugin (
        {
          cacheId: 'my-car',
          dontCacheBustUrlsMatching: /\.\w{8}\./,
          filename: 'service-worker.js',
          minify: true,
          navigateFallback: PUBLIC_PATH + 'index.html',
          staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
        }
      )
    ]
  }
}
