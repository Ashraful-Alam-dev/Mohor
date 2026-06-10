import pool from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrderInDb = async ({ userId, items, shippingAddress, phone, paymentMethod, clearCart }) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    let totalAmount = 0;
    const verifiedItems = [];

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
        price_at_purchase: product.price,
        product_name: product.name
      });
    }

    const orderId = uuidv4(); 

    await connection.execute(
      `INSERT INTO orders (id, user_id, total_amount, shipping_name, shipping_phone, shipping_address, payment_reference, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [orderId, userId, totalAmount, 'Customer Delivery', phone, shippingAddress, paymentMethod || 'Cash on Delivery']
    );

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

// NEW: Get order by ID with access control
export const getOrderByIdFromDb = async (orderId, userId = null, userRole = null) => {
  let query = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.total_amount AS total_price,
      o.status,
      o.created_at AS ordertime,
      o.shipping_name,
      o.shipping_phone,
      o.shipping_address,
      COALESCE(o.payment_reference, 'Cash on Delivery') AS payment_method,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', p.id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price_at_purchase', oi.price_at_purchase,
          'subtotal', (oi.quantity * oi.price_at_purchase)
        )
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?
  `;
  
  const params = [orderId];
  
  // If userId is provided and user is not admin, filter by user_id
  if (userId && userRole !== 'admin') {
    query += ` AND o.user_id = ?`;
    params.push(userId);
  }
  
  query += ` GROUP BY o.id`;
  
  const [rows] = await pool.execute(query, params);
  
  if (rows.length === 0) return null;
  
  // Parse items if they're stored as JSON string
  if (rows[0].items && typeof rows[0].items === 'string') {
    rows[0].items = JSON.parse(rows[0].items);
  }
  
  return rows[0];
};

// NEW: Restore product quantities when order is cancelled
export const restoreOrderQuantities = async (orderId) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    // Get order items
    const [items] = await connection.execute(
      `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
      [orderId]
    );
    
    // Restore quantities
    for (const item of items) {
      await connection.execute(
        `UPDATE products SET quantity = quantity + ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }
    
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};