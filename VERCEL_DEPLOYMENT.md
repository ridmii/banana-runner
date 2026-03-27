# Vercel Deployment Guide

## Overview
This app is a full-stack application with:
- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Node.js/Express + MongoDB (deploy separately)

## Frontend Deployment to Vercel

### Step 1: Connect Your Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your `banana-runner` repository
5. Click "Import"

### Step 2: Configure Build Settings
Vercel should auto-detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

These are already set in `vercel.json`.

### Step 3: Set Environment Variables
In the Vercel project settings, add:

- `VITE_SERVER_URL`: Your backend API URL (e.g., `https://your-api.railway.app` or `https://your-backend.render.com`)

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

---

## Backend Deployment Options

Since Vercel is primarily for frontend, you have several options for the backend:

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add MongoDB plugin
4. Set environment variables in Railway dashboard:
   - `PORT`: 5000
   - `MONGO_URI`: Connection string from Railway MongoDB
   - `JWT_SECRET`: Strong random string
   - `CLIENT_URL`: Your Vercel frontend URL
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if using OAuth)
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (if using OAuth)
5. Deploy and copy the API URL

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `node server/src/server.js`
5. Add environment variables
6. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Add MongoDB plugin: `heroku addons:create mongolab`
4. Set environment variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

---

## Update After Backend Deployment

Once your backend is deployed:

1. Get your backend API URL (e.g., `https://banana-runner-api.railway.app`)
2. In Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Update `VITE_SERVER_URL` with your backend URL
   - Trigger a redeploy or push a commit to trigger redeploy

---

## Environment Variables Summary

### Backend (.env in server directory)
```
PORT=5000
MONGO_URI=mongodb+srv://...
MONGO_DB_NAME=banana-runner
JWT_SECRET=your_strong_secret
CLIENT_URL=https://your-vercel-app.vercel.app
CLIENT_URLS=https://your-vercel-app.vercel.app
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
```

### Frontend (Set in Vercel Project Settings)
```
VITE_SERVER_URL=https://your-backend-api.com
```

---

## Testing After Deployment

1. Visit your Vercel frontend URL
2. Check browser console for any API errors
3. Try logging in / creating an account
4. Verify game loads correctly
5. Check leaderboard functionality

If you see CORS errors, update `CLIENT_URLS` in your backend environment variables.

---

## Troubleshooting

### CORS Errors
- Update `CLIENT_URLS` environment variable in backend to include your Vercel domain

### API Connection Errors
- Verify `VITE_SERVER_URL` in Vercel matches your actual backend URL
- Check backend server logs
- Ensure backend environment variables are set correctly

### Build Failures
- Check Vercel build logs for errors
- Ensure all dependencies are in `client/package.json`
- Verify JavaScript syntax

---

## Next Steps

1. Commit these changes: `git add . && git commit -m "chore: add Vercel deployment configuration"`
2. Push to your branch and create/merge PR
3. Deploy backend to your chosen platform
4. Deploy frontend to Vercel
5. Connect them via environment variables
