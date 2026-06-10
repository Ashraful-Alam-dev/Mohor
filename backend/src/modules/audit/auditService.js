import pool from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const getActorName = async (actorUserId) => {
  if (!actorUserId) return 'System';

  const [rows] = await pool.execute(
    `SELECT name FROM users WHERE id = ? LIMIT 1`,
    [actorUserId]
  );

  return rows.length ? rows[0].name : 'System';
};

export const createAuditLog = async ({
  actionType,
  entityType,
  entityId,
  actorUserId,
  description,
}) => {
  const actorName = await getActorName(actorUserId);

  await pool.execute(
    `
    INSERT INTO audit_logs
    (
      id,
      action_type,
      entity_type,
      entity_id,
      actor_user_id,
      actor_name,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      uuidv4(),
      actionType,
      entityType,
      entityId,
      actorUserId || null,
      actorName,
      description,
    ]
  );
};

export const logProductCreated = async (
  product,
  actorUserId
) => {
  await createAuditLog({
    actionType: 'Product',
    entityType: 'product',
    entityId: product.id,
    actorUserId,
    description: `New product has been created as ${product.name}`,
  });
};

export const logProductDeleted = async (
  product,
  actorUserId
) => {
  await createAuditLog({
    actionType: 'Product',
    entityType: 'product',
    entityId: product.id,
    actorUserId,
    description: `Product ${product.name} has been deleted`,
  });
};

export const logProductUpdated = async (
  oldProduct,
  updatedData,
  actorUserId
) => {
  const changes = [];

  if (
    updatedData.name !== undefined &&
    updatedData.name !== oldProduct.name
  ) {
    changes.push(`Name: "${oldProduct.name}" → "${updatedData.name}"`);
  }

  if (
    updatedData.category !== undefined &&
    updatedData.category !== oldProduct.category
  ) {
    changes.push(`Category: "${oldProduct.category}" → "${updatedData.category}"`);
  }

  if (
    updatedData.price !== undefined &&
    Number(updatedData.price) !== Number(oldProduct.price)
  ) {
    changes.push(`Price: ${oldProduct.price} → ${updatedData.price}`);
  }

  if (
    updatedData.quantity !== undefined &&
    Number(updatedData.quantity) !== Number(oldProduct.quantity)
  ) {
    changes.push(`Quantity: ${oldProduct.quantity} → ${updatedData.quantity}`);
  }

  if (
    updatedData.description !== undefined &&
    updatedData.description !== oldProduct.description
  ) {
    changes.push(`Description updated`);
  }

  if (changes.length === 0) return;

  await createAuditLog({
    actionType: 'Product',
    entityType: 'product',
    entityId: oldProduct.id,
    actorUserId,
    description: `${oldProduct.name} Updated: ${changes.join(', ')}`,
  });
};

/* ===========================
   USER AUDIT METHODS
=========================== */

export const logUserCreated = async (
  user,
  actorUserId = null
) => {
  await createAuditLog({
    actionType: 'User',
    entityType: 'user',
    entityId: user.id,
    actorUserId,
    description: `New user has joined with name ${user.name}`,
  });
};

export const logUserUpdated = async (
  oldUser,
  updatedData,
  actorUserId
) => {
  const changes = [];

  if (
    updatedData.name !== undefined &&
    updatedData.name !== oldUser.name
  ) {
    changes.push(`Name: "${oldUser.name}" → "${updatedData.name}"`);
  }

  if (
    updatedData.phone !== undefined &&
    updatedData.phone !== oldUser.phone
  ) {
    changes.push(`Phone: "${oldUser.phone}" → "${updatedData.phone}"`);
  }

  if (
    updatedData.address !== undefined &&
    updatedData.address !== oldUser.address
  ) {
    changes.push(`Address: "${oldUser.address || 'N/A'}" → "${updatedData.address || 'N/A'}"`);
  }

  if (changes.length === 0) return;

  await createAuditLog({
    actionType: 'User',
    entityType: 'user',
    entityId: oldUser.id,
    actorUserId,
    description: `${oldUser.name} Profile Updated: ${changes.join(', ')}`,
  });
};

export const getAllAuditLogsService = async (
  entityType = null
) => {
  let query = `
    SELECT
      id,
      action_type,
      entity_type,
      entity_id,
      actor_name,
      description,
      executed_at
    FROM audit_logs
  `;

  const params = [];

  if (entityType) {
    query += ` WHERE entity_type = ? `;
    params.push(entityType);
  }

  query += `
    ORDER BY executed_at DESC
    LIMIT 500
  `;

  const [rows] = await pool.execute(query, params);
  return rows;
};

/* ===========================
   CART AUDIT METHODS
=========================== */

// FIXED: Accept productId and fetch product details if needed
export const logCartAdded = async (
  productId,  // Can be string ID or product object
  actorUserId,
  quantity = 1
) => {
  // Check if product is an object with name property or just ID
  let productName = 'Product';
  let finalProductId = productId;
  
  if (typeof productId === 'object' && productId !== null) {
    // Product object passed
    productName = productId.name || productId.product_name || 'Product';
    finalProductId = productId.id || productId.product_id;
  } else {
    // Just product ID passed - optionally fetch product name
    try {
      const [product] = await pool.execute(
        'SELECT name FROM products WHERE id = ? LIMIT 1',
        [productId]
      );
      if (product.length > 0) {
        productName = product[0].name;
      }
    } catch (error) {
      console.error('Error fetching product name for audit:', error);
    }
  }
  
  await createAuditLog({
    actionType: "Cart",
    entityType: "cart",
    entityId: finalProductId,
    actorUserId,
    description: `Added ${quantity} x ${productName} to cart`,
  });
};

// FIXED: Accept productId and fetch product details
export const logCartRemoved = async (
  product,  // Can be product object or product ID
  actorUserId,
  quantity = null
) => {
  let productName = 'Product';
  let productId = product;
  let quantityText = '';
  
  if (typeof product === 'object' && product !== null) {
    // Product object passed
    productName = product.name || product.product_name || 'Product';
    productId = product.id || product.product_id;
    quantityText = quantity ? ` (${quantity} units)` : '';
  } else {
    // Just product ID passed
    try {
      const [prodResult] = await pool.execute(
        'SELECT name FROM products WHERE id = ? LIMIT 1',
        [product]
      );
      if (prodResult.length > 0) {
        productName = prodResult[0].name;
      }
      quantityText = quantity ? ` (${quantity} units)` : '';
    } catch (error) {
      console.error('Error fetching product name for audit:', error);
    }
  }
  
  await createAuditLog({
    actionType: "Cart",
    entityType: "cart",
    entityId: productId,
    actorUserId,
    description: `Removed ${productName} from cart${quantityText}`,
  });
};

// FIXED: Accept productId and fetch product details
export const logCartQuantityUpdated = async (
  product,  // Can be product object or product ID
  oldQuantity,
  newQuantity,
  actorUserId
) => {
  let productName = 'Product';
  let productId = product;
  
  if (typeof product === 'object' && product !== null) {
    // Product object passed
    productName = product.name || product.product_name || 'Product';
    productId = product.id || product.product_id;
  } else {
    // Just product ID passed
    try {
      const [prodResult] = await pool.execute(
        'SELECT name FROM products WHERE id = ? LIMIT 1',
        [product]
      );
      if (prodResult.length > 0) {
        productName = prodResult[0].name;
      }
    } catch (error) {
      console.error('Error fetching product name for audit:', error);
    }
  }
  
  await createAuditLog({
    actionType: "Cart",
    entityType: "cart",
    entityId: productId,
    actorUserId,
    description: `${productName} quantity changed: ${oldQuantity} → ${newQuantity}`,
  });
};

/* ===========================
   ORDER AUDIT METHODS
=========================== */

// Add these to your existing auditService.js

/* ===========================
   ORDER AUDIT METHODS (Enhanced)
=========================== */

export const logOrderPlaced = async (order, actorUserId) => {
  await createAuditLog({
    actionType: "Order",
    entityType: "order",
    entityId: order.id,
    actorUserId,
    description: `Placed order worth ৳${order.total_amount}`,
  });
};

export const logOrderStatusUpdated = async (
  orderId,
  oldStatus,
  newStatus,
  actorUserId,
  actorRole,
  orderDetails = null
) => {
  let description = `Order status updated: ${oldStatus} → ${newStatus}`;
  
  if (orderDetails) {
    description += ` for order worth ৳${orderDetails.total_price || orderDetails.total_amount}`;
  }
  
  if (actorRole === 'admin') {
    description += ` by admin`;
  }
  
  await createAuditLog({
    actionType: "Order",
    entityType: "order",
    entityId: orderId,
    actorUserId,
    description: description,
  });
};

export const logOrderCancelled = async (
  orderId,
  actorUserId,
  actorRole = 'user',
  orderDetails = null
) => {
  let description = `Order cancelled`;
  
  if (orderDetails) {
    description += ` (worth ৳${orderDetails.total_price || orderDetails.total_amount})`;
  }
  
  if (actorRole === 'admin') {
    description += ` by admin`;
  } else {
    description += ` by customer`;
  }
  
  await createAuditLog({
    actionType: "Order",
    entityType: "order",
    entityId: orderId,
    actorUserId,
    description: description,
  });
};

// Optional: For tracking order views
export const logOrderViewed = async (userId, orderCount) => {
  await createAuditLog({
    actionType: "View",
    entityType: "order",
    entityId: null,
    actorUserId: userId,
    description: `Viewed ${orderCount} order(s)`,
  });
};

export const logOrderDetailView = async (orderId, userId, userRole) => {
  await createAuditLog({
    actionType: "View",
    entityType: "order",
    entityId: orderId,
    actorUserId: userId,
    description: `Viewed order details${userRole === 'admin' ? ' (admin)' : ''}`,
  });
};

export const logAdminOrderView = async (adminId, orderCount, searchTerm = null) => {
  let description = `Admin viewed ${orderCount} order(s)`;
  if (searchTerm) {
    description += ` searching for "${searchTerm}"`;
  }
  
  await createAuditLog({
    actionType: "View",
    entityType: "order",
    entityId: null,
    actorUserId: adminId,
    description: description,
  });
};