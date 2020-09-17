// eslint-disable-next-line @typescript-eslint/no-var-requires
// const CircularDependencyPlugin = require('circular-dependency-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: 'http://localhost:8000'
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,

  // output built static files to Laravel's public dir.
  // note the "build" script in package.json needs to be modified as well.
  outputDir: '../api/public/assets',

  publicPath: '/assets',

  pwa: {
    themeColor: '#42b983',
    msTileColor: '#42b983',
    appleMobileWebAppCache: 'yes',
    manifestOptions: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      background_color: '#42b983',
      name: 'Climbers guide',
      // eslint-disable-next-line @typescript-eslint/camelcase
      short_name: 'Climbs'
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      swDest: '../service-worker.js',
      exclude: [/\.html$/]
    }
  },

  // modify the location of the generated HTML file.
  indexPath: process.env.NODE_ENV === 'production'
    ? '../../resources/views/index.blade.php'
    : 'index.html',
  css: {
    extract: true
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
}
