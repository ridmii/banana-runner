import dotenv from 'dotenv';
dotenv.config();

function parseOrigins(value) {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  mongoDbName: process.env.MONGO_DB_NAME,
  jwtSecret: process.env.JWT_SECRET || 'devsecret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  clientOrigins: parseOrigins(process.env.CLIENT_URLS || ''),
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  nodeEnv: process.env.NODE_ENV || 'development',
  disableAuth: process.env.DISABLE_AUTH === 'true',
  disableDb: process.env.DISABLE_DB === 'true'
};
