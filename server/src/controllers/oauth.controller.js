import axios from 'axios';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

// Helper to set auth cookie
function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd ? true : false, 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

// Google OAuth callback
export async function googleAuth(req, res) {
  try {
    const { token } = req.body; // ID token from Google Sign-In SDK
    if (!token) return res.status(400).json({ message: 'Missing token' });

    // Verify token with Google
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${token}`
    );
    const { email, name, picture } = googleResponse.data;
    const googleId = googleResponse.data.user_id;

    if (!email) return res.status(400).json({ message: 'Could not retrieve email from Google' });

    // Find or create user - use email as primary key for OAuth
    let user = await User.findOne({ email, oauthProvider: 'google' });
    if (!user) {
      // Check if email exists at all
      user = await User.findOne({ email });
      if (user) {
        // Existing account - link to Google
        user.googleId = googleId;
        user.oauthProvider = 'google';
      } else {
        // New user - create with simple username
        let username = name?.split(' ')[0] || email.split('@')[0];
        user = await User.create({
          username,
          email,
          googleId,
          oauthProvider: 'google',
          password: null,
        });
      }
    } else if (!user.googleId) {
      user.googleId = googleId;
    }

    user.lastLogin = new Date();
    await user.save();

    // Issue JWT
    const jwtToken = signToken({ id: user._id, role: user.role, username: user.username });
    setAuthCookie(res, jwtToken);

    return res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google auth error:', err.message, err.response?.data || err);
    return res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
}

// GitHub OAuth callback
export async function githubAuth(req, res) {
  try {
    const { code } = req.body; // Authorization code from GitHub
    if (!code) return res.status(400).json({ message: 'Missing code' });

    if (!env.githubClientId || !env.githubClientSecret) {
      console.error('GitHub credentials not configured:', { id: !!env.githubClientId, secret: !!env.githubClientSecret });
      return res.status(500).json({ message: 'GitHub OAuth not configured' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: env.githubClientId,
        client_secret: env.githubClientSecret,
        code,
        redirect_uri: `${env.clientUrl}/login`,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token, error, error_description } = tokenResponse.data;
    if (error || !access_token) {
      console.error('GitHub token exchange failed:', error, error_description);
      return res.status(400).json({ message: `GitHub auth failed: ${error_description || 'No token returned'}` });
    }

    // Fetch user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id: githubId, login, name, avatar_url } = userResponse.data;

    // Get email if not public
    let email = userResponse.data.email;
    if (!email) {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const primaryEmail = emailResponse.data.find((e) => e.primary);
      email = primaryEmail?.email;
    }

    if (!email) return res.status(400).json({ message: 'Could not retrieve email from GitHub' });

    // Find or create user - use email as primary key for OAuth
    let user = await User.findOne({ email, oauthProvider: 'github' });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Link existing account to GitHub
        user.githubId = githubId;
        user.oauthProvider = 'github';
      } else {
        // Create new user with simple username
        let username = login || name?.split(' ')[0] || email.split('@')[0];
        user = await User.create({
          username,
          email,
          githubId,
          oauthProvider: 'github',
          password: null,
        });
      }
    } else if (!user.githubId) {
      user.githubId = githubId;
    }

    user.lastLogin = new Date();
    await user.save();

    // Issue JWT
    const jwtToken = signToken({ id: user._id, role: user.role, username: user.username });
    setAuthCookie(res, jwtToken);

    return res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('GitHub auth error:', err.message);
    console.error('GitHub error details:', {
      status: err.response?.status,
      data: err.response?.data,
      stack: err.stack,
    });
    return res.status(500).json({ message: 'GitHub authentication failed', error: err.message });
  }
}
