// Vercel serverless function entry for Express app
// This file allows deploying the Express API on Vercel under /api

const app = require('../src/app');

module.exports = (req, res) => {
  // Vercel passes req/res compatible with Node http, Express can handle it
  return app(req, res);
};