const debug = require('debug')('server');

import http from 'http';

import app from './index';

let currentApp = app.callback();
const server = http.createServer(currentApp);
const HOST = process.env['SERVER.HOST'];
const PORT = process.env['SERVER.PORT'];

server.listen(PORT, err => {
  if (err) {
    debug(err);
  } else {
    debug(`Svelte SSR server is running at http://${HOST}:${PORT} env:${process.env.NODE_ENV}`);
  }

});

if (module.hot) {
  module.hot.accept('./index', () => {
    server.removeListener('request', currentApp);
    currentApp = app.callback();
    server.on('request', currentApp);
  });
}
