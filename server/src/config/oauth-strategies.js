import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';
import { User } from '../models/User.js';
import { env } from './env.js';

// Only initialize OAuth strategies if credentials are provided
if (env.googleClientId && env.googleClientSecret) {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy.Strategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: `${env.appUrl}/api/auth/oauth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value;
        const googleUsername = `${profile.displayName.replace(/\s+/g, '_')}_${profile.id.substring(0, 5)}`;
        
        // Try to find existing user by email
        let user = await User.findOne({ email: googleEmail });
        
        // If not found by email, try to find by username (for existing players who want to link Google)
        if (!user) {
          user = await User.findOne({ username: googleUsername });
        }
        
        // If still not found, create new user
        if (!user) {
          user = await User.create({
            email: googleEmail,
            username: googleUsername,
            password: '', // OAuth users don't have passwords
            role: 'player',
            avatar: '🐒'
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
} else {
  console.warn('⚠️  Google OAuth credentials not set. OAuth login disabled.');
}

if (env.githubClientId && env.githubClientSecret) {
  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy.Strategy(
    {
      clientID: env.githubClientId,
      clientSecret: env.githubClientSecret,
      callbackURL: `${env.appUrl}/api/auth/oauth/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const githubEmail = profile.emails?.[0]?.value || `${profile.username}@github.local`;
        const githubUsername = profile.username || `github_${profile.id}`;
        
        // Try to find existing user by email
        let user = await User.findOne({ email: githubEmail });
        
        // If not found by email, try to find by username (for existing players who want to link GitHub)
        if (!user) {
          user = await User.findOne({ username: githubUsername });
        }
        
        // If still not found, create new user
        if (!user) {
          user = await User.create({
            email: githubEmail,
            username: githubUsername,
            password: '', // OAuth users don't have passwords
            role: 'player',
            avatar: '🐒'
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
} else {
  console.warn('⚠️  GitHub OAuth credentials not set. OAuth login disabled.');
}

// Serialize/deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
