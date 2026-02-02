# Design Decisions

## Frontend
- Vite + React 18 for fast dev
- @react-three/fiber + drei for Three.js integration
- React Router for navigation and protected routes
- Axios with `withCredentials` for cookie-based JWT
- Chart.js for leaderboard visualization

## Backend
- Express + Mongoose
- JWT in httpOnly cookie for security
- Role-based access via middleware
- Socket.io for realtime leaderboard (optional)

## Game Architecture
- Central `gameEvents` bus for event-driven mechanics
- Physics and collision helpers in `utils/`
- Instanced meshes for banana performance

## Version Control
- Branching: main, develop, feature/*
- Meaningful commit messages; PRs for features
