# 🍌 Banana Runner — 3D Endless Runner Web Game

A **3D browser-based endless runner** where you dodge obstacles, collect bananas, and solve math puzzles — built with React, Three.js, and a full-stack Node.js backend.

> Run. Collect. Think. Compete.

---

## 🎮 Gameplay

- **Lane-based running** — Move left and right across 3 lanes to avoid obstacles
- **Jump & Slide** — Jump over rocks (↑ / W / Space) and slide under logs (↓ / S)
- **Collect bananas** — Grab bananas on the track to increase your score
- **Solve puzzles** — Hit an obstacle? Answer a banana math question to continue (powered by an external Banana API)
- **3 lives** — Wrong answers or skipping questions costs a life
- **Level progression** — Unlock Bronze (25 🍌), Silver (75 🍌), and Gold (150 🍌) tiers
- **Leaderboard** — Compete with other players for the top spot
- **SFX** — Procedural Web Audio sound effects for collect, success, and error events

### Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Move Left | ← Arrow | Left button |
| Move Right | → Arrow | Right button |
| Jump | ↑ / W / Space | Jump button |
| Slide | ↓ / S | Slide button |

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Three.js (r158+), @react-three/fiber, @react-three/drei, React Router v6, Axios |
| **3D Engine** | Three.js with instanced meshes, particle systems, environment lighting, shadow maps |
| **Backend** | Node.js, Express, Mongoose, JWT (httpOnly cookies), bcrypt, Socket.io |
| **Database** | MongoDB (Atlas or local via Docker) |
| **DevOps** | Docker Compose, npm workspaces, Concurrently, Nodemon |

---

## 📁 Project Structure

```
banana-runner/
├── client/                   # Vite + React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Login & Register pages
│   │   │   ├── game/         # 3D game world, player, obstacles, bananas, UI
│   │   │   ├── leaderboard/  # Global leaderboard with podium & rankings
│   │   │   ├── menu/         # Main menu with level progression display
│   │   │   ├── profile/      # Player profile with stats & achievements
│   │   │   └── ui/           # Shared navbar
│   │   ├── context/          # Auth context provider
│   │   ├── services/         # API client, auth service, banana API service
│   │   ├── styles/           # Global CSS & design variables
│   │   └── utils/            # Event bus, level calculator, SFX engine
│   └── public/assets/        # Static assets
├── server/                   # Express + MongoDB backend
│   ├── src/
│   │   ├── controllers/      # Route handlers (auth, game, leaderboard, admin)
│   │   ├── middleware/        # JWT auth & admin role middleware
│   │   ├── models/           # Mongoose schemas (User, Score, GameStat)
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # External Banana API proxy
│   │   └── utils/            # JWT helpers, logger, achievement calculator
│   └── package.json
├── docs/                     # API docs, design docs, setup guide
├── wireframes/               # UI wireframes for all screens
├── docker-compose.yml        # MongoDB + server containers
└── package.json              # Workspace root (npm workspaces)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **MongoDB** — either [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud) or local via Docker

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd banana-runner
npm install
```

This installs dependencies for both `client/` and `server/` via npm workspaces.

### 2. Configure Environment

Create `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/banana-runner
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173
```

### 3. Start Development Servers

```bash
npm run dev
```

This runs both servers in parallel:

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:5000 |

### Alternative: Docker (MongoDB only)

```bash
docker-compose up -d mongo
npm run dev
```

Or run the full stack in Docker:

```bash
docker-compose up --build
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Login (sets JWT cookie) |
| `POST` | `/api/auth/logout` | — | Clear session |
| `GET` | `/api/auth/me` | ✅ | Current user info |
| `GET` | `/api/banana` | — | Fetch banana math question (external API proxy) |
| `POST` | `/api/game/score` | ✅ | Submit game score |
| `GET` | `/api/game/stats` | ✅ | Player game statistics |
| `GET` | `/api/leaderboard` | — | Top 10 global leaderboard |
| `GET` | `/api/leaderboard/user` | ✅ | Current user's rank |
| `GET` | `/api/admin/users` | 🔒 | All users (admin only) |
| `DELETE` | `/api/admin/users/:id` | 🔒 | Delete user (admin only) |
| `GET` | `/api/admin/stats` | 🔒 | Global game statistics (admin only) |
| `GET` | `/api/health` | — | Health check |

---

## 🏆 Features

### Level & Achievement System

| Level | Title | Bananas Required |
|-------|-------|-----------------|
| 0 | Beginner | 0 |
| 1 | Bronze Runner | 25 |
| 2 | Silver Sprinter | 75 |
| 3 | Gold Champion | 125+ |

**Achievements:** First Game 🎮 · Score Master 🏆 · Banana Collector 🍌 · Speed Demon ⚡ · Persistent Player 💪

### Player Profile

- Editable username
- Animated stat counters (games played, total bananas, best time)
- Level badge with progress bar to next tier
- Achievement showcase
- Recent game activity feed

### Leaderboard

- Top 3 podium display with gold/silver/bronze
- Full ranking list with level icons and achievement counts
- Real-time updates via event bus (refreshes on score submission)
- Highlights current player's position

---

## 🎨 Game Architecture

```
Canvas (Three.js)
├── CameraRig          — Smooth camera follow with lerp
├── Static Environment — Trees, rocks, terrain (never moves)
├── Dynamic Gameplay   — Bananas, obstacles, power-ups (scroll toward player)
├── Player Character   — Monkey or Robot model with lane movement
├── Visual Effects     — Particle system (300 particles)
└── GameLoop           — useFrame tick: physics, collision, spawning
```

**Key design decisions:**
- **Ref-based physics** — Position, velocity, and tilt stored in `useRef` for frame-accurate, jitter-free movement (avoids React state batching delays)
- **Visual smoothing** — Player component applies per-axis interpolation for silky rendering
- **Event bus** — Custom `GameEvents` class for decoupled cross-component communication
- **Prefetched questions** — Banana API questions are fetched ahead of time for instant display on collision

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server concurrently |
| `npm run dev:client` | Frontend only (Vite dev server) |
| `npm run dev:server` | Backend only (Nodemon) |
| `npm run build -w client` | Production build of frontend |
| `npm start -w server` | Start server in production mode |

---

## 📖 Documentation

- [docs/SETUP.md](docs/SETUP.md) — Detailed setup instructions
- [docs/API.md](docs/API.md) — Full API reference
- [docs/DESIGN.md](docs/DESIGN.md) — Architecture & design decisions
- [wireframes/](wireframes/) — UI wireframes for every screen

---

## 📋 Data Models

**User** — username, email, password (hashed), role (user/admin), totalGames, totalScore, highScore, totalBananas

**Score** — userId, score, gameMode (solo/multiplayer), duration, bananasCollected, timestamp

**GameStat** — Global aggregates: totalGamesPlayed, totalBananasCollected, totalObstaclesDodged
