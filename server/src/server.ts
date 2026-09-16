import app from './app';
import { config } from './config/config';
import { connectDB } from './config/db';
import { seedDatabase } from './services/seedService';

const startServer = async () => {
  try {
    console.log('[Server] Connecting to database...');
    await connectDB();

    console.log('[Server] Checking and seeding initial system records...');
    await seedDatabase();

    const host = process.env.HOST || '0.0.0.0';
    app.listen(config.port, host, () => {
      console.log(`=======================================================`);
      console.log(`🚀 ColoAI-Polyp Express Backend running on port ${config.port}`);
      console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`🤖 AI Service Target: ${config.aiServiceUrl}`);
      console.log(`📁 Uploads Directory: ${config.uploadDir}`);
      console.log(`📄 Reports Directory: ${config.reportsDir}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('[Server] Fatal startup failure:', error);
    process.exit(1);
  }
};

startServer();
