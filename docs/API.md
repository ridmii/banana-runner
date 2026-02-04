# API Documentation

## Auth
- POST /api/auth/register — {username, email, password}
- POST /api/auth/login — {email, password}
- POST /api/auth/logout
- GET /api/auth/me — returns user info (requires cookie JWT)

## Banana
- GET /api/banana — proxy to external Banana API
- GET /api/banana/types — returns mock banana types

## Game
- POST /api/game/score — save score (auth required)
- GET /api/game/stats — aggregated stats

## Leaderboard
- GET /api/leaderboard — top 10 scores
- GET /api/leaderboard/user — current user's rank (auth required)

## Admin
- GET /api/admin/users — list users (admin)
- DELETE /api/admin/users/:id — delete user (admin)
- GET /api/admin/stats — admin stats
