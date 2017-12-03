const axios = require('axios');

const config = require('./config');

const deprecations = async (ctx, next) => {
  console.log(config)
  let instance = axios.create({
    method: 'get',
    baseURL: 'https://api.github.com',
    headers: {Accept: 'application/vnd.github.cloak-preview'},
    auth: {
      username: config.githubUser,
      password: config.githubToken,
    }
  });
  let response = await instance.get('/search/commits?q=org:emartech+deprecator&order=desc&sort=committer-date');
  ctx.body = response.data;
  ctx.response.status = 200;
};

module.exports = { deprecations };
