import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser } from './authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;