// eslint-disable-next-line @typescript-eslint/no-var-requires
// const CircularDependencyPlugin = require('circular-dependency-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack');

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

  publicPath: process.env.NODE_ENV === 'production'
    ? '/assets'
    : '/',

  pwa: {
    themeColor: '#42b983',
    msTileColor: '#42b983',
    appleMobileWebAppCache: 'yes',
    manifestOptions: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      background_color: '#42b983',
      name: 'ClimbLine',
      // eslint-disable-next-line @typescript-eslint/camelcase
      short_name: 'ClimbLine',
      description: 'Community maintained online climbers guide. Complete with topo images and gps locations',
      // eslint-disable-next-line @typescript-eslint/camelcase
      start_url: '/',
      icons: [
        {
          src: '/assets/img/icons/android-chrome-192x192.png?v=dLXnEKLwoR',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/assets/img/icons/android-chrome-384x384.png?v=dLXnEKLwoR',
          sizes: '384x384',
          type: 'image/png'
        }
      ]
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      swDest: '../service-worker.js'
    }
  },

  // modify the location of the generated HTML file.
  indexPath: process.env.NODE_ENV === 'production'
    ? '../../resources/views/index.blade.php'
    : 'index.html',
  css: {
    extract: true
  },
  chainWebpack: config => {
    config.plugin('html').tap((args) => {
      args[0].minify = {
        ...args[0].minify,
        removeAttributeQuotes: false
      }
      return args
    })
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en\-gb/),
    ]
  }
}
