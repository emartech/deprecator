'use strict';

const
  Koa = require('koa'),
  serve = require('koa-static'),
  bodyParser = require('koa-bodyparser'),
  config = require('./config'),

const app = new Koa();

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
});

app.use(serve('public'));

const server = app.listen(config.port);
console.log(`Deprecator is listening on port http://localhost:${config.port}`);

