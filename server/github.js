const axios = require('axios');
const _ = require('underscore');

const config = require('./config');

const instance = axios.create({
  method: 'get',
  baseURL: 'https://api.github.com',
  headers: {Accept: 'application/vnd.github.cloak-preview'},
  auth: {
    username: config.githubUser,
    password: config.githubToken,
  }
});

const CACHE = {};
const CACHE_CONTROL_MILLIS = 5 * 60 * 1000 // 5 minutes

const load = async () => {
  const response = await instance.get('/search/commits?q=org:emartech+deprecate&order=desc&sort=author-date');
  response.data.items.forEach(c => {
    CACHE[c.sha] = { url: c.url };
  });
  return response.data.items.map(c => ({
    url: c.url,
    html_url: c.html_url,
    sha: c.sha,
    date: c.commit.author.date,
    author_name: c.commit.author.name,
    msg: c.commit.message,
    author: _.pick(c.author, 'login', 'avatar_url'),
  }));
}

const deprecations = async (ctx, next) => {
  const now = (new Date).getTime();
  if (!CACHE.lastUpdate || CACHE.lastUpdate + CACHE_CONTROL_MILLIS < now) {
    CACHE.last = await load();
    CACHE.lastUpdate = now;
  }
  ctx.body = _.head(CACHE.last, 20);
  ctx.response.status = 200;
};

const win = async (ctx, next) => {
  const sha = ctx.params.sha;
  const commit = CACHE[sha];
  if (!commit || !commit.url) {
    ctx.response.status = 400;
    return;
  }
  if (commit.stats) {
    ctx.body = commit;
    ctx.response.status = 200;
    return;
  }

  const response = await instance.get(commit.url);
  commit.stats = response.data.stats;
  commit.stats.win = commit.stats.deletions - commit.stats.additions
  ctx.body = commit;
  ctx.response.status = 200;
}

module.exports = { deprecations, win };
