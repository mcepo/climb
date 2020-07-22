
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const CircularDependencyPlugin = require('circular-dependency-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const PurgecssPlugin = require('purgecss-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
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

  // modify the location of the generated HTML file.
  indexPath: process.env.NODE_ENV === 'production'
    ? '../../resources/views/index.blade.php'
    : 'index.html'
  // configureWebpack: {
  //  plugins: [

  //     new CircularDependencyPlugin({
  //       // exclude detection of files based on a RegExp
  //       exclude: /a\.js|node_modules/,
  //       // include specific files based on a RegExp
  //       // include: /dir/,
  //       // add errors to webpack instead of warnings
  //       failOnError: true,
  //       // allow import cycles that include an asyncronous import,
  //       // e.g. via import(/* webpackMode: "weak" */ './file.js')
  //       allowAsyncCycles: false,
  //       // set the current working directory for displaying module paths
  //       cwd: process.cwd()
  //     })
  //   ]
  // }
}
