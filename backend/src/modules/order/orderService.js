import pool from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrderInDb = async ({ userId, items, shippingAddress, phone, paymentMethod, clearCart }) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    let totalAmount = 0;
    const verifiedItems = [];

    // Step A: Read specifications & calculate secure total amounts
    for (const item of items) {
      const [prodRows] = await connection.execute(
        'SELECT id, name, price, quantity FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      );
      
      const product = prodRows[0];
      if (!product) {
        throw new Error(`Product mapping failed for ID ${item.product_id}`);
      }
      
      if (product.quantity < item.selected_quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}`);
      }

      const itemTotal = parseFloat(product.price) * item.selected_quantity;
      totalAmount += itemTotal;

      verifiedItems.push({
        product_id: product.id,
        quantity: item.selected_quantity,
        price_at_purchase: product.price
      });
    }

    const orderId = uuidv4(); 

    // Store incoming paymentMethod parameter into the payment_reference column
    await connection.execute(
      `INSERT INTO orders (id, user_id, total_amount, shipping_name, shipping_phone, shipping_address, payment_reference, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [orderId, userId, totalAmount, 'Customer Delivery', phone, shippingAddress, paymentMethod || 'Cash on Delivery']
    );

    // Step C: Append lines to order_items & update inventory allocations
    for (const item of verifiedItems) {
      const orderItemId = uuidv4(); 
      
      await connection.execute(
        `INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)`,
        [orderItemId, orderId, item.product_id, item.quantity, item.price_at_purchase]
      );

      await connection.execute(
        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    if (clearCart) {
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    }

    await connection.commit();
    return { orderId, totalAmount };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getUserOrdersFromDb = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
      o.id AS order_id,
      o.total_amount AS total_price,
      o.status,
      o.created_at AS ordertime,
      COALESCE(o.payment_reference, 'Cash on Delivery') AS payment_method,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_name', p.name,
          'quantity', oi.quantity,
          'price_at_purchase', oi.price_at_purchase
        )
      ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE o.user_id = ?
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
};

export const getAllOrdersForAdminFromDb = async (searchProduct = '') => {
  const queryParams = [];
  
  let query = `
    SELECT 
      o.id AS order_id,
      COALESCE(u.name, o.shipping_name) AS user_name,
      o.shipping_phone AS user_number,
      o.shipping_address AS address,
      o.total_amount AS total_price,
      o.status,
      o.created_at AS ordertime,
      COALESCE(NULLIF(o.payment_reference, ''), 'Cash on Delivery') AS payment_method,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_name', COALESCE(p.name, 'Unknown Product'),
          'quantity', COALESCE(oi.quantity, 1),
          'price_at_purchase', COALESCE(oi.price_at_purchase, 0.00)
        )
      ) AS items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
  `;

  if (searchProduct.trim() !== '') {
    query += ` WHERE p.name LIKE ? `;
    queryParams.push(`%${searchProduct}%`);
  }

  query += `
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  const [rows] = await pool.execute(query, queryParams);
  return rows;
};

export const updateOrderStatusInDb = async (orderId, status) => {
  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid system fulfillment status sequence requested.');
  }

  const [result] = await pool.execute(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, orderId]
  );

  if (result.affectedRows === 0) {
    throw new Error('Target order identifier lookup failed.');
  }
  return true;
};