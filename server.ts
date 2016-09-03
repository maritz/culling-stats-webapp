import * as path from 'path';
import * as express from 'express';
import * as webpack from 'webpack';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'docs')));
} else {

  const config = require('./webpack.config.js');
  let compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.use('/', express.static(path.join(__dirname, 'src', 'client')));
}

app.listen(3041, 'localhost', (err: Error | string) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://0.0.0.0:3040');
});

// require the module as normal
const bs = require('browser-sync').create();

// .init starts the server
bs.init({
  files: [path.join(__dirname, 'src', 'client', 'style.css')],
  host: '0.0.0.0',
  port: 3040,
  proxy: 'http://localhost:3041',
  ui: false,
  open: false,
});

