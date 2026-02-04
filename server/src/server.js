import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: env.clientUrl, credentials: true },
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
});

// Global handlers to avoid process exit on unexpected errors
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

(async () => {
  try {
    const dbOk = await connectDB();
    if (!dbOk) {
      console.warn('Server running without database features.');
    }
  } catch (err) {
    console.error('Error during DB init:', err);
    console.warn('Proceeding to start server without database.');
  }
  server.listen(env.port, () => console.log(`Server listening on ${env.port}`));
})();
