import express from 'express';
import { registerUser, loginUser } from './authController.js';

const router = express.Router();

// POST /api/auth/register (Requires Firebase OTP validation)
router.post('/register', registerUser);

// POST /api/auth/login (Credentials-only validation)
router.post('/login', loginUser);

export default router;