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

const deprecations = async (ctx, next) => {
  const response = await instance.get('/search/commits?q=org:emartech+deprecate&order=desc&sort=author-date');

  ctx.body = _.head(response.data.items, 10).map(c => ({
    url: c.url,
    date: c.commit.author.date,
    msg: c.commit.message,
    author: _.pick(c.author, 'login', 'avatar_url'),
  }));
  ctx.response.status = 200;
};

module.exports = { deprecations };
