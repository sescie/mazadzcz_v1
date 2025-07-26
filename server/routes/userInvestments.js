// routes/userInvestments.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, isAdmin } = require('../middleware/auth');

/**
 * GET all investments assigned to a given user.
 * e.g. GET /admin/users/:userId/investments
 */
router.get(
  '/admin/users/:userId/investments',
  auth,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const [rows] = await db.query(
        `SELECT i.*
         FROM investments i
         JOIN user_investments ui
           ON i.id = ui.investment_id
         WHERE ui.user_id = ?`,
        [userId]
      );
      res.json(rows);
    } catch (err) {
      console.error('Fetch user investments error:', err);
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  }
);

/**
 * POST assign an investment to a user.
 * e.g. POST /admin/users/:userId/investments
 * body: { investmentId: "…" }
 */
router.post(
  '/admin/users/:userId/investments',
  async (req, res) => {
    try {
      const { userId } = req.params;
      const {
        investmentId,
        units,
        purchase_price,
        notes,
        source = 'ADMIN'
      } = req.body;

      console.log(`request body:`, req.body); // Debug log

      // Validate required fields
      if (!investmentId || !units || !purchase_price) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['investmentId', 'units', 'purchase_price']
        });
      }

      // Auto-fetch asset type from investments
      const [[investment]] = await db.query(
        `SELECT asset_class, price FROM investments WHERE id = ?`,
        [investmentId]
      );
      if (!investment) {
        return res.status(404).json({ error: 'Investment not found' });
      }

      const returnRate = ((investment.price - purchase_price) / purchase_price) * 100;

      await db.query(
        `INSERT INTO user_investments (
          user_id, investment_id, units, purchase_price,
          current_value, return_rate, asset_type, notes, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          investmentId,
          units,
          purchase_price,
          (units * investment.price).toFixed(2),
          returnRate.toFixed(2),
          investment.asset_class,
          notes || null,
          source
        ]
      );

      res.status(201).json({ message: 'Investment assigned successfully' });
    } catch (err) {
      console.error('Assign investment error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Investment already assigned to this user' });
      }
      res.status(500).json({ error: 'Assignment failed' });
    }
  }
);

/**
 * DELETE unassign a specific investment from a user.
 * e.g. DELETE /admin/users/:userId/investments/:investmentId
 */
router.delete(
  '/admin/users/:userId/investments/:investmentId',
  auth, isAdmin,
  async (req, res) => {
    try {
      const { userId, investmentId } = req.params;
      await db.query(
        `DELETE FROM user_investments
         WHERE user_id = ? AND investment_id = ?`,
        [userId, investmentId]
      );
      res.json({ message: 'Unassigned investment' });
    } catch (err) {
      console.error('Unassign error:', err);
      res.status(500).json({ error: 'Failed to unassign' });
    }
  }
);

module.exports = router;
