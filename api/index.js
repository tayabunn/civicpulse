let app;
try {
  app = require('../backend/dist/server.js');
} catch (e) {
  try {
    app = require('./backend/dist/server.js');
  } catch (e2) {
    app = require('../dist/server.js');
  }
}
const handler = app?.default || app;

module.exports = (req, res) => {
  return handler(req, res);
};
