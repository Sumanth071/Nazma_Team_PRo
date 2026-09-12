import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './config';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (config.mongoUri) {
      console.log(`[DB] Attempting connection to MongoDB at ${config.mongoUri}...`);
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('[DB] Connected successfully to configured MongoDB.');
      return;
    }

    console.log('[DB] No MONGODB_URI provided. Initializing in-memory MongoDB server for development...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`[DB] Connected successfully to In-Memory MongoDB (${uri}).`);
  } catch (error) {
    console.warn('[DB] Failed to connect to configured MongoDB. Falling back to In-Memory MongoDB...', error);
    try {
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
        const uri = mongoMemoryServer.getUri();
        await mongoose.connect(uri);
        console.log(`[DB] Connected to In-Memory MongoDB fallback (${uri}).`);
      }
    } catch (fallbackError) {
      console.error('[DB] Fatal error: Could not initialize database connection.', fallbackError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
