import pool from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';


export const addItemToCartInDb = async (userId, { productId, quantity }) => {
  
  const [prodCheck] = await pool.execute('SELECT quantity FROM products WHERE id = ?', [productId]);
  if (prodCheck.length === 0) throw new Error('Target catalog item not found.');
  
  const availableStock = prodCheck[0].quantity;

  const [existingItem] = await pool.execute(
    'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existingItem.length > 0) {
    
    const newQuantity = existingItem[0].quantity + parseInt(quantity);
    
    if (newQuantity > availableStock) {
      throw new Error(`Cannot add more items. Only ${availableStock} units are available in stock.`);
    }

    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existingItem[0].id]
    );
    return { itemId: existingItem[0].id, productId, quantity: newQuantity };
  } else {
    
    if (parseInt(quantity) > availableStock) {
      throw new Error(`Requested allocation exceeds current stock of ${availableStock} units.`);
    }

    const newItemId = uuidv4();
    await pool.execute(
      'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
      [newItemId, userId, productId, quantity]
    );
    return { itemId: newItemId, productId, quantity };
  }
};

export const getUserCartFromDb = async (userId) => {
  const query = `
    SELECT 
      c.id AS cart_item_id,
      c.quantity AS selected_quantity,
      p.id AS product_id,
      p.name,
      p.price,
      p.category,
      p.quantity AS available_stock,
      (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1) AS thumbnail_url
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  
  
  const [rows] = await pool.execute(query, [userId]); 
  return rows;
};


export const updateCartItemQuantityInDb = async (userId, itemId, quantity) => {

  const [itemCheck] = await pool.execute(
    'SELECT product_id FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId]
  );
  if (itemCheck.length === 0) return false;

  const [prodCheck] = await pool.execute('SELECT quantity FROM products WHERE id = ?', [itemCheck[0].product_id]);
  if (quantity > prodCheck[0].quantity) {
    throw new Error(`Insufficient stock. Only ${prodCheck[0].quantity} available.`);
  }

  const [result] = await pool.execute(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, itemId, userId]
  );
  return result.affectedRows > 0;
};

export const removeCartItemFromDb = async (userId, itemId) => {
  const [result] = await pool.execute(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId]
  );
  return result.affectedRows > 0;
};