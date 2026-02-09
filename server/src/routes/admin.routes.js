import { Router } from 'express';
import { listUsers, deleteUser, adminStats } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();
router.get('/users', requireAuth, requireAdmin, listUsers);
router.delete('/users/:id', requireAuth, requireAdmin, deleteUser);
router.get('/stats', requireAuth, requireAdmin, adminStats);
export default router;
