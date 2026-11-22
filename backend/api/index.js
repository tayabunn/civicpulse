const app = require('../dist/server.js');
const handler = app?.default || app;

module.exports = (req, res) => {
  return handler(req, res);
};
