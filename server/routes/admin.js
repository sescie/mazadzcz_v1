const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, isAdmin } = require('../middleware/auth');

// Get Pending Users
router.get('/pending-users', auth, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, email, full_name, phone, created_at 
       FROM users 
       WHERE role = 'pending'`
    );
    res.json(users);
  } catch (err) {
    console.error('Fetch pending users error:', err);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// Approve User
router.put('/approve-user/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query(
      `UPDATE users 
       SET role = 'investor' 
       WHERE id = ?`,
      [req.params.id]
    );
    res.json({ message: 'User approved successfully' });
  } catch (err) {
    console.error('User approval error:', err);
    res.status(500).json({ error: 'User approval failed' });
  }
});
//Un Approve user
router.put('/un-approve-user/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query(
      `UPDATE users 
       SET role = 'pending' 
       WHERE id = ?`,
      [req.params.id]
    );
    res.json({ message: 'User unapproved successfully' });
  } catch (err) {
    console.error('User unapproval error:', err);
    res.status(500).json({ error: 'User unapproval failed' });
  }
});

router.patch(
  '/requests/:reqId/approve',
  auth, isAdmin,
  async (req, res) => {
    const { reqId } = req.params;
    // Pull overrides from body
    const { units: overrideUnits, purchase_price: overridePrice } = req.body;

    // 1) Fetch the pending request (just amount & IDs)
    const [[reqRow]] = await db.query(
      `SELECT user_id, investment_id, amount
       FROM investment_requests
       WHERE id = ? AND status = 'Pending'`,
      [reqId]
    );
    if (!reqRow) {
      return res.status(404).json({ error: 'No pending request found' });
    }

    // 2) Fetch live price & asset class
    const [[inv]] = await db.query(
      `SELECT price AS marketPrice, asset_class
       FROM investments
       WHERE id = ?`,
      [reqRow.investment_id]
    );
    if (!inv) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    const marketPrice = parseFloat(inv.marketPrice);

    // 3) Compute defaults
    const defaultUnits = reqRow.amount / marketPrice;
    const defaultPurchasePrice = marketPrice;

    // 4) Apply overrides if provided
    const finalUnits = overrideUnits != null
      ? parseFloat(overrideUnits)
      : defaultUnits;
    const finalPurchasePrice = overridePrice != null
      ? parseFloat(overridePrice)
      : defaultPurchasePrice;

    // 5) Compute derived fields
    const currentValue = +(finalUnits * marketPrice).toFixed(2);
    const returnRate = +(((marketPrice - finalPurchasePrice) / finalPurchasePrice) * 100).toFixed(2);

    // 6) Insert into user_investments
    await db.query(
      `INSERT INTO user_investments
         (user_id, investment_id, units, purchase_price,
          current_value, return_rate, asset_type, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reqRow.user_id,
        reqRow.investment_id,
        finalUnits,
        finalPurchasePrice,
        currentValue,
        returnRate,
        inv.asset_class,
        'ADMIN'
      ]
    );

    // 7) Mark request approved
    await db.query(
      `UPDATE investment_requests
         SET status = 'Approved',
             handled_by_admin = ?,
             handled_at = NOW(),
             updated_at = NOW()
       WHERE id = ?`,
      [req.user.id, reqId]
    );

    res.json({ message: 'Request approved and investment assigned' });
  }
);


/**
 * PATCH /api/requests/:reqId/reject
 * Reject a pending investment request →
 *   simply mark it Rejected + handled_by_admin + handled_at
 */
router.patch(
  '/requests/:reqId/reject',
  auth, isAdmin,
  async (req, res) => {
    const { reqId } = req.params;

    const [result] = await db.query(
      `UPDATE investment_requests
         SET status = 'Rejected',
             handled_by_admin = ?,
             handled_at = NOW(),
             updated_at = NOW()
       WHERE id = ? AND status = 'Pending'`,
      [req.user.id, reqId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No pending request found' });
    }

    res.json({ message: 'Request rejected' });
  }
);

module.exports = router;
module.exports = router;