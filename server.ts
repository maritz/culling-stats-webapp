import * as path from 'path';
import * as express from 'express';
import * as webpack from 'webpack';

const config = require('./webpack.config.js');

let app = express();
let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/static', express.static(path.join(__dirname, 'src', 'client')));

app.listen(3040, '0.0.0.0', (err: Error | string) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://0.0.0.0:3040');
});

/*import * as express from 'express';

const app = express();

app.use('/', express.static(__dirname + '/dist/client/'));

app.listen(3040, '0.0.0.0');
console.log('Listening on http://0.0.0.0:3040/');
*/
