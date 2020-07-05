var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './client/source/js/app.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'client/source')
  },
  devServer: {
    contentBase: path.join(__dirname, 'client/source'),
    port: 4000,
    public: 'localhost:4000',
    watchContentBase: true
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        // set up standard-loader as a preloader
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'standard-loader',
        exclude: /(node_modules)/,
        options: {
          // Emit errors instead of warnings (default = false)
          error: false,
          // enable snazzy output (default = true)
          snazzy: true
        }
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader' }]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/source/index.html',
      favicon: './client/source/favicon.ico',
      filename: 'index.html',
      inject: false
    })
  ]
}
