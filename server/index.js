'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const config = require('./config');

const app = new Koa();

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
});

app.use(serve('public'));

const server = app.listen(config.port);
console.log(`Deprecator is listening on port http://localhost:${config.port}`);

