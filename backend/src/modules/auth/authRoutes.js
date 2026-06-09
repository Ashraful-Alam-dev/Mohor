import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser, updateProfile, changePassword } from './authController.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, roleMiddleware('customer'), getCurrentUser);
router.put('/profile/update', authMiddleware, roleMiddleware('customer'), updateProfile);
router.patch('/profile/change-password', authMiddleware, roleMiddleware('customer'),  changePassword);

export default router;