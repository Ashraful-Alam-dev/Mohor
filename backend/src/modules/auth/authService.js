import pool from '../../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

export const findUserByPhoneService = async (phone) => {
  const query = 'SELECT * FROM users WHERE phone = ? LIMIT 1';
  const [rows] = await pool.execute(query, [phone]);
  
  return rows.length > 0 ? rows[0] : null;
};

export const findUserByIdService = async (id) => {
  const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;

  const [rows] = await pool.execute(query, [id]);

  return rows.length ? rows[0] : null;
};

export const updateUserService = async (id, { name, phone, address }) => {
  await pool.execute(
    `UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?`,
    [name, phone, address || null, id]
  );

  return { id, name, phone, address };
};

/* ---------------- UPDATE PASSWORD ---------------- */
export const updateUserPasswordService = async (id, newPassword) => {
  const hash = await bcrypt.hash(newPassword, 10);

  await pool.execute(
    `UPDATE users SET password = ? WHERE id = ?`,
    [hash, id]
  );

  return true;
};