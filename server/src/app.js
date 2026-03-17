import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { env } from './config/env.js';
import './config/oauth-strategies.js'; // Initialize OAuth strategies
import authRoutes from './routes/auth.routes.js';
import oauthRoutes from './routes/oauth.routes.js';
import bananaRoutes from './routes/banana.routes.js';
import gameRoutes from './routes/game.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

// Session middleware for OAuth (required by Passport)
app.use(session({
  secret: env.jwtSecret || 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: env.NODE_ENV === 'production', 
    httpOnly: true,
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = new Set([env.clientUrl, ...env.clientOrigins, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://127.0.0.1:5173']);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        if (allowedOrigins.has(origin) || (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
          return callback(null, true);
        }
      } catch (_) {}
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/auth/oauth', oauthRoutes);
app.use('/api/banana', bananaRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

export default app;
