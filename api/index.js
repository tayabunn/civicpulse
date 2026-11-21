const app = require('../backend/dist/server.js');
const handler = app.default || app;

module.exports = (req, res) => {
  return handler(req, res);
};
