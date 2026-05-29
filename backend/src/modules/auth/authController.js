import { createUserService, findUserByPhoneService } from './authService.js';
import admin from '../../config/firebase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * POST /api/auth/register
 * Validates Firebase ID Token from client and saves user credentials to MySQL
 */
export const registerUser = async (req, res, next) => {
  try {
    const { firebaseToken, name, password, address } = req.body;

    // 1. Strict payload validation
    if (!firebaseToken || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing parameters. Name, password, and firebaseToken are required.'
      });
    }

    // 2. Exchange token with Firebase Admin SDK instance
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    } catch (firebaseError) {
      console.error("🔥 Firebase Token Verification Crash:", firebaseError.message);
      return res.status(401).json({
        success: false,
        message: `Firebase identity verification failed: ${firebaseError.message}`
      });
    }

    // Extract the verified phone number from the decoded token payload
    const phone = decodedToken.phone_number;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Firebase token is valid, but no verified phone number was found.'
      });
    }

    // 3. Save parameters using the transactional data service layer
    console.log(`Saving verified user: ${phone} to database...`);
    const newUser = await createUserService({ name, phone, address, password });

    // 4. Return successful response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: newUser
    });

  } catch (error) {
    console.error("🚨 CRITICAL REGISTRATION CONTROLLER ERROR:", error);
    
    // Fallback response prevents the frontend button from spinning forever on error
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during registration process.'
    });
  }
};

/**
 * POST /api/auth/login
 * Validates local MySQL storage credentials and issues secure custom application JWTs
 */
export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // 1. Inputs validation
    if (!phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and password are required inputs.' 
      });
    }

    // 2. Query data engine for matched credentials profile
    const user = await findUserByPhoneService(phone);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid phone number or password credentials.' 
      });
    }

    // 3. Cryptographically compare raw entry against saved Bcrypt hash values
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid phone number or password credentials.' 
      });
    }

    // 4. Issue system identity JWT tracking tokens (valid for 1 day)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Send secure affirmative handshake profile parameters back to Next.js
    return res.status(200).json({
      success: true,
      message: 'Login authentication verified successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error("🚨 CRITICAL LOGIN CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error during login process.'
    });
  }
};