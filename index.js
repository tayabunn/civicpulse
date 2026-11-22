let handler;

try {
  const app = require('./backend/dist/server.js');
  handler = app?.default || app;
} catch (err) {
  handler = (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Backend root initialization failed',
      message: err.message,
      stack: err.stack,
    }, null, 2));
  };
}

module.exports = handler;
