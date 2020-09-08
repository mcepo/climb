// eslint-disable-next-line @typescript-eslint/no-var-requires
// const CircularDependencyPlugin = require('circular-dependency-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: 'http://localhost:8000'
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,

  // output built static files to Laravel's public dir.
  // note the "build" script in package.json needs to be modified as well.
  outputDir: '../api/public',

  publicPath: '/',

  configureWebpack: {
    plugins: [
      new InjectManifest({
        swSrc: './src/service-worker.js',
        swDest: '../api/public',
        exclude: [/\.html$/]
      })
    ]
  },

  // modify the location of the generated HTML file.
  indexPath: process.env.NODE_ENV === 'production'
    ? '../resources/views/index.blade.php'
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
