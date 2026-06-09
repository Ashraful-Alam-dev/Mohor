import pool from '../../config/db.js';
import { createUserService, findUserByPhoneService, findUserByIdService, updateUserService, updateUserPasswordService  } from './authService.js';
import admin from '../../config/firebase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  try {
    const { firebaseToken, name, password, address } = req.body;

    if (!firebaseToken || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing parameters. Name, password, and firebaseToken are required.'
      });
    }

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

    const phone = decodedToken.phone_number;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Firebase token is valid, but no verified phone number was found.'
      });
    }

    const existingUser =
      await findUserByPhoneService(phone);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Phone number already registered",
      });
    }
    const newUser = await createUserService({ name, phone, address, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: newUser
    });

  } catch (error) {
    console.error("🚨 CRITICAL REGISTRATION CONTROLLER ERROR:", error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during registration process.'
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and password are required inputs.' 
      });
    }

    const user = await findUserByPhoneService(phone);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid phone number or password credentials.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid phone number or password credentials.' 
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

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

export const getCurrentUser = async (req, res) => {
  try {
    const user = await findUserByIdService(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updated = await updateUserService(req.user.id, {
      name,
      phone,
      address,
    });

    return res.json({
      success: true,
      user: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.execute(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    const user = rows[0];

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    await updateUserPasswordService(
      req.user.id,
      newPassword
    );

    return res.json({
      success: true,
      message: "Password updated",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};