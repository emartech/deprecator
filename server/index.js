'use strict';

const Koa = require('koa');
const Router = require('koa-router');

const serve = require('koa-static');

const config = require('./config');
const github = require('./github');

const app = new Koa();

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
});

const router = new Router();
router.get('/deprecations', github.deprecations);
router.get('/win/:sha', github.win);

app.use(serve('public'))
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(config.port);
console.log(`Deprecator is listening on port http://localhost:${config.port}`);

