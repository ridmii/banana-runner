import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (env.disableDb) {
    console.warn('Database disabled via DISABLE_DB=true. Skipping Mongo connection.');
    return false;
  }
  if (!env.mongoUri) {
    console.warn('MONGO_URI not set. Skipping Mongo connection and continuing without DB.');
    return false;
  }
  try {
    mongoose.set('strictQuery', true);
    const options = env.mongoDbName ? { dbName: env.mongoDbName } : {};
    await mongoose.connect(env.mongoUri, options);
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection failed:', err?.message || err);
    console.warn('Continuing server startup without database. Set DISABLE_DB=true to suppress this message.');
    return false;
  }
}
