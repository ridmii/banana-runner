# 3D Banana Runner - Cosmic Harvest

A 3D endless runner built with React, Three.js (@react-three/fiber), and a Node/Express/MongoDB backend. Demonstrates four themes: Virtual Identity, Interoperability, Event-Driven Programming, and Version Control.

## Tech Stack
- Frontend: React 18, Vite, Three.js (r158+), @react-three/fiber, @react-three/drei, React Router, Axios, Chart.js
- Backend: Node.js, Express, JWT, bcrypt, CORS, dotenv, Mongoose, Socket.io
- Database: MongoDB (Atlas or local)

## Monorepo Structure
- client: Vite React frontend
- server: Express/Mongo backend

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string or local MongoDB

### Setup
1. Install dependencies and scaffold client/server:
```bash
npm init -y
npm install -D concurrently
npm create vite@latest client -- --template react
cd client && npm install three @react-three/fiber @react-three/drei react-router-dom axios chart.js && cd ..
mkdir server && cd server && npm init -y && npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcrypt socket.io && npm install -D nodemon && cd ..
```
2. Configure server environment:
- Copy `server/.env.example` to `server/.env` and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.

3. Run development servers in parallel:
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Scripts
- `npm run dev` — runs client (Vite) and server (nodemon) concurrently
- `npm run dev -w client` — frontend only
- `npm run dev -w server` — backend only

## Themes
- Virtual Identity: JWT auth, role-based routes
- Interoperability: Banana API proxy, external libraries
- Event-Driven: central event bus, keyboard handlers, animation loop
- Version Control: git repo with branches and meaningful commits

## Docs
See docs/SETUP.md, docs/API.md, docs/DESIGN.md for details.
