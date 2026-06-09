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

  // ❗ IMPORTANT: ONLY ONE LOG ENTRY
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

  const [rows] = await pool.execute(
    query,
    params
  );

  return rows;
};