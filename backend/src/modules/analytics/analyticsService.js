import pool from "../../config/db.js";

/* =========================
   CUSTOMER ANALYTICS
========================= */

export const getCustomerAnalytics = async (userId) => {
  // 1. Total actions from audit logs
  const [totalActions] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM audit_logs
    WHERE actor_user_id = ?
    `,
    [userId]
  );

  // 2. Actions by type (cart, order, profile, etc.)
  const [actionTypes] = await pool.execute(
    `
    SELECT action_type, COUNT(*) AS count
    FROM audit_logs
    WHERE actor_user_id = ?
    GROUP BY action_type
    ORDER BY count DESC
    `,
    [userId]
  );

  // 3. Weekly activity (last 7 days)
  const [weekly] = await pool.execute(
    `
    SELECT DATE(executed_at) AS date, COUNT(*) AS count
    FROM audit_logs
    WHERE actor_user_id = ?
      AND executed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(executed_at)
    ORDER BY date ASC
    `,
    [userId]
  );

  // 4. Monthly activity (last 30 days)
  const [monthly] = await pool.execute(
    `
    SELECT DATE(executed_at) AS date, COUNT(*) AS count
    FROM audit_logs
    WHERE actor_user_id = ?
      AND executed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(executed_at)
    ORDER BY date ASC
    `,
    [userId]
  );

  // 5. Most active section (cart/order/profile)
  const [topSection] = await pool.execute(
    `
    SELECT entity_type, COUNT(*) AS count
    FROM audit_logs
    WHERE actor_user_id = ?
    GROUP BY entity_type
    ORDER BY count DESC
    LIMIT 1
    `,
    [userId]
  );

  return {
    totalActions: totalActions[0].total,
    actionTypes,
    weeklyActivity: weekly,
    monthlyActivity: monthly,
    topSection: topSection[0] || null,
  };
};

/* =========================
   ADMIN ANALYTICS
========================= */

export const getAdminAnalytics = async () => {
  // 1. total admin actions
  const [total] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM audit_logs
    WHERE actor_user_id IS NOT NULL
    `
  );

  // 2. product actions breakdown
  const [productStats] = await pool.execute(
    `
    SELECT description
    FROM audit_logs
    WHERE entity_type = 'product'
    `
  );

  // 3. action breakdown
  const [actions] = await pool.execute(
    `
    SELECT action_type, COUNT(*) AS count
    FROM audit_logs
    GROUP BY action_type
    ORDER BY count DESC
    `
  );

  return {
    totalAdminActions: total[0].total,
    productStats,
    actionBreakdown: actions,
  };
};