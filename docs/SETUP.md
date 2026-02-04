# Setup Instructions

## Environment
- Node.js 18+
- MongoDB Atlas or local MongoDB

## Server .env
Copy `server/.env.example` to `server/.env` and set:
- MONGO_URI
- JWT_SECRET
- CLIENT_URL (e.g., http://localhost:5173)

## Install & Run
```bash
npm init -y
npm install -D concurrently
npm create vite@latest client -- --template react
cd client && npm install three @react-three/fiber @react-three/drei react-router-dom axios chart.js && cd ..
mkdir server && cd server && npm init -y && npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcrypt socket.io && npm install -D nodemon && cd ..
npm run dev
```

## Notes
- CORS is configured with credentials; axios uses `withCredentials`.
- Leaderboard updates can use Socket.io or polling.
