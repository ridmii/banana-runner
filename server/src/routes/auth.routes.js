import { Router } from 'express';
import { register, login, logout, me, updateProfile, changePassword, getAvatarOptions } from '../controllers/auth.controller.js';
import { googleAuth, githubAuth } from '../controllers/oauth.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);
router.get('/avatars', getAvatarOptions);
router.post('/google', googleAuth);
router.post('/github', githubAuth);
export default router;
