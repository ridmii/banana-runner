import { Router } from 'express';
import { topLeaderboard, userRank, richLeaderboard } from '../controllers/leaderboard.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', topLeaderboard);
router.get('/rich', richLeaderboard);
router.get('/user', requireAuth, userRank);
export default router;
