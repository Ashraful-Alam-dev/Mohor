import pool from '../../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// ... Keep your existing createUserService here ...

export const createUserService = async ({ name, phone, address, password }) => {
  const userId = uuidv4();
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const query = `
    INSERT INTO users (id, name, phone, address, password, role) 
    VALUES (?, ?, ?, ?, ?, 'customer')
  `;
  const values = [userId, name, phone, address || null, passwordHash];
  await pool.execute(query, values);

  return { id: userId, name, phone, address, role: 'customer' };
};

// NEW: Pure data operation to query user profile details
export const findUserByPhoneService = async (phone) => {
  const query = 'SELECT * FROM users WHERE phone = ? LIMIT 1';
  const [rows] = await pool.execute(query, [phone]);
  
  // Return the single matched user record profile object, or null
  return rows.length > 0 ? rows[0] : null;
};