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
//  const response = await instance.get('/search/commits?q=org:emartech+deprecate&order=desc&sort=author-date');
}

module.exports = { deprecations, win };
