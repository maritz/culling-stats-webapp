const path = require('path');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';
const staging = process.env.node_ENV === 'staging';

const clientFiles = ['./src/client/index.tsx'];
if (!production && !staging) {
  clientFiles.unshift('webpack-hot-middleware/client');
}

module.exports = {
  entry: {
    'client': clientFiles,
    'worker': './src/worker/index.ts'
  },
  progress: true,
  watch: ! production,
  devtool: production ? 'source-map' : 'eval',
  target: 'web',
  bail: production,
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
        include: [
          path.join(__dirname, 'src', 'worker')
        ],
        loaders: ['babel', {
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
  plugins:
    production || staging
      ? []
      : [ new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin() ]
  ,
  ts: {
    transpileOnly: true
  }
}
