// routes/userActivity.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, isAdmin } = require('../middleware/auth');

/**
 * GET user activity log
 * e.g. GET /admin/users/:userId/activity
 */
// /routes/admin.js

router.get('/admin/users/:userId/activity', auth, isAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user basic info
    const [userRows] = await db.query(
      `SELECT id, email, full_name FROM users WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user investment holdings with details
    const [investmentRows] = await db.query(
      `
      SELECT 
        i.id AS investment_id,
        i.name,
        i.asset_class,
        i.sector,
        i.industry,
        i.price,
        i.currency,
        i.last_price_update,
        ui.units,
        ROUND(ui.units * i.price, 2) AS current_value
      FROM investments i
      JOIN user_investments ui ON ui.investment_id = i.id
      WHERE ui.user_id = ?
      `,
      [userId]
    );

    // Get user's latest 50 activity logs
    const [activityRows] = await db.query(
      `
      SELECT id, activity_type, description, timestamp
      FROM user_activities
      WHERE user_id = ?
      ORDER BY timestamp DESC
      LIMIT 50
      `,
      [userId]
    );
    // Format and send response
    res.json({
      user: userRows[0],
      investments: investmentRows.map(inv => ({
        ...inv,
        last_price_update: new Date(inv.last_price_update).toISOString(),
      })),
      activity: activityRows.map(row => ({
        ...row,
        timestamp: new Date(row.timestamp).toISOString()
      }))
    });
  } catch (err) {
    console.error('Fetch user activity error:', err);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});


module.exports = router;