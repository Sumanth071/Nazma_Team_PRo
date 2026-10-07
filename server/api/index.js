const app = require('../dist/app').default;
const { connectDB } = require('../dist/config/db');
const { seedDatabase } = require('../dist/services/seedService');

let isReady = false;

module.exports = async (req, res) => {
  if (!isReady) {
    try {
      await connectDB();
      await seedDatabase();
      isReady = true;
    } catch (err) {
      console.error('[Vercel Serverless] DB Init error:', err);
    }
  }
  return app(req, res);
};
