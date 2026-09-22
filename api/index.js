import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/database.js';

let dbConnected = false;

export default async function handler(req, res) {
  // Ensure database is connected before handling the request
  if (!dbConnected) {
    try {
      const ok = await connectDB();
      if (ok) {
        dbConnected = true;
      }
    } catch (err) {
      console.error('DB connect error in serverless function:', err);
    }
  }
  
  // Forward the request to your Express app
  return app(req, res);
}
