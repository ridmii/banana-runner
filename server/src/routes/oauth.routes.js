import { Router } from 'express';
import passport from 'passport';
import { handleOAuthCallback } from '../controllers/auth.controller.js';
import { env } from '../config/env.js';

const router = Router();

// Debug endpoint to show expected callback URL
router.get('/debug', (req, res) => {
  res.json({
    expectedGoogleCallback: `${env.appUrl}/api/auth/oauth/google/callback`,
    expectedGithubCallback: `${env.appUrl}/api/auth/oauth/github/callback`,
    appUrl: env.appUrl,
    message: 'Copy the callback URLs above into your OAuth app settings in Google Cloud Console and GitHub'
  });
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
  handleOAuthCallback
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=github_auth_failed' }),
  handleOAuthCallback
);

export default router;
