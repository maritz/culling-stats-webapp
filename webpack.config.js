const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'client': ['webpack-hot-middleware/client', './src/client/index.tsx'],
    'worker': './src/worker/index.ts'
  },
  progress: true,
  watch: process.env.NODE_ENV !== 'production',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
  target: 'web',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: '/static/'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /worker\/.*\.tsx?$/,
        exclude: /node_modules/,
        loaders: [{
          loader: 'ts-loader',
          query: {
            configFileName: path.join(__dirname, 'src', 'worker', 'tsconfig.json')
          }
        }]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: ['babel', {
          loader: 'ts-loader',
          query: {
            configFileName: path.join(__dirname, 'tsconfig.json')
          }
        }]
      }
    ]
  },
  plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
  ],
  ts: {
    transpileOnly: true
  }
}
