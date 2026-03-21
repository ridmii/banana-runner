# OAuth Setup Guide (Google & GitHub)

This guide explains how to set up OAuth authentication with Google and GitHub for Banana Runner.

## Why OAuth?

OAuth eliminates the need for users to remember passwords—they can log in directly with their Google or GitHub account. Our implementation:
- Creates/links users automatically on first login
- Assigns the `player` role by default
- Stores the JWT session in an httpOnly cookie
- Maintains the same security level as traditional password auth

## Setup Steps

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/oauth/google/callback` (local dev)
   - `https://yourdomain.com/api/auth/oauth/google/callback` (production)
7. Copy the **Client ID** and **Client Secret**
8. Add to your `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

### 2. GitHub OAuth Setup

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Banana Runner`
   - **Homepage URL**: `http://localhost:5000` (development) or your domain
   - **Authorization callback URL**: 
     - `http://localhost:5000/api/auth/oauth/github/callback` (local)
     - `https://yourdomain.com/api/auth/oauth/github/callback` (production)
4. Copy the **Client ID** and **Client Secret**
5. Add to your `.env`:
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### 3. Environment Variables

Add the following to your `server/.env`:

```env
# Existing vars
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# OAuth
APP_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. Start the App

```bash
npm run dev  # from root; starts both client and server
```

Visit `http://localhost:5173/login` and click the Google or GitHub button.

## How It Works

1. **User clicks "Google" or "GitHub" button** → redirects to `/api/auth/oauth/{provider}`
2. **Passport middleware** → authenticates with the provider
3. **Strategy callback** → checks if user exists; creates new `player` if not
4. **JWT issued** → stored in httpOnly cookie
5. **Redirect** → back to homepage with session active

## Roles & Permissions

- **player** (default): can play the game, submit scores, see leaderboard
- **admin**: can manage users, delete/moderate scores, view dashboard

To make a user admin, either:
- **Via MongoDB**: `db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})`
- **Via admin endpoint**: `POST /api/admin/users/{userId}/role` with `{role: "admin"}`

## API Endpoints

### Public Auth
- `POST /api/auth/register` — email + password registration
- `POST /api/auth/login` — email + password login
- `GET /api/auth/oauth/google` — start Google OAuth flow
- `GET /api/auth/oauth/github` — start GitHub OAuth flow
- `POST /api/auth/logout` — clear httpOnly cookie

### Admin (requires `role: admin`)
- `GET /api/admin/users` — list all users
- `POST /api/admin/users/{userId}/role` — set user role
- `GET /api/admin/stats` — view dashboard stats
- `DELETE /api/admin/scores/{scoreId}` — moderate scores
- `DELETE /api/admin/users/{id}` — delete user account

## Troubleshooting

### Google OAuth: "Error 400: redirect_uri_mismatch"

**Root cause:** The callback URL you registered in Google Cloud Console doesn't match what your server is sending.

**How to verify the correct callback URL:**

Your server is configured to use this callback URL:
```
http://localhost:5000/api/auth/oauth/google/callback
```

To verify this is correct, visit: `http://localhost:5000/api/auth/oauth/debug`

You should see:
```json
{
  "expectedGoogleCallback": "http://localhost:5000/api/auth/oauth/google/callback",
  "expectedGithubCallback": "http://localhost:5000/api/auth/oauth/github/callback",
  "appUrl": "http://localhost:5000"
}
```

**How to fix:**

1. **Log into Google Cloud Console:**
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Select your project
   - Navigate to "APIs & Services" → "Credentials"
   - Find your OAuth 2.0 Client ID (Web application)
   - Click it to see the details

2. **Update "Authorized redirect URIs":**
   - Look for the "Authorized redirect URIs" section
   - **Delete any existing entries** (if they're different from below)
   - **Add exactly this:** `http://localhost:5000/api/auth/oauth/google/callback`
   - ⚠️ **CRITICAL: No trailing slashes, no typos, must match exactly**
   - Click "Save"

3. **Important:** If you already added a callback URL, make sure it's an exact match. Common mistakes:
   - ❌ `http://localhost:5000/api/auth/oauth/google/callback/` (trailing slash)
   - ❌ `http://localhost:5000/login` (wrong path)
   - ❌ `http://localhost:5173/callback` (wrong port)
   - ❌ `http://localhost/api/auth/oauth/google/callback` (missing port)
   - ✅ `http://localhost:5000/api/auth/oauth/google/callback` (correct)

4. **Restart your server:**
   ```bash
   npm run dev
   ```

5. **Try again:**
   - Visit `http://localhost:5173/login`
   - Click the Google button
   - You should be redirected to Google's login, then back to the app

### GitHub OAuth: "E11000 duplicate key error on username"

**Status: FIXED** ✅

This error occurred when trying to log in with a GitHub account that had the same username as an existing player account. The fix now handles this gracefully:

- If you have a player account with username `ridmii`, you can now log in with GitHub using the same username
- If a GitHub user account profile doesn't have an email, it uses `{username}@github.local` as a fallback
- If email/username already exists, you'll be logged in automatically instead of creating a duplicate

**What changed:**
- OAuth strategies now check for existing users by both email AND username
- Existing accounts can now be linked with GitHub/Google OAuth
- No more duplicate key errors when usernames match

### Testing OAuth Without Credentials

If you don't have Google/GitHub OAuth credentials yet, you can still test the app:

1. Visit `http://localhost:5173/register`
2. Create an account with email + password
3. Log in to play the game
4. OAuth buttons will be visible but inactive (they won't crash)

## Next Steps

- Deploy to production and update OAuth callback URLs
- Implement refresh tokens if needed (2h session is default)
- Add logout from other devices (token revocation)
- Consider PKCE flow for SPA if client-side OAuth handling needed

---

For more details, see [Passport.js docs](http://www.passportjs.org/) and [server/src/config/oauth-strategies.js](server/src/config/oauth-strategies.js).
