// routes/investmentRequests.js

const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { auth, isAdmin } = require('../middleware/auth');

/**
 * GET all requests (admin)
 * GET /api/requests?status=Pending
 */
router.get(
  '/requests',
  auth, isAdmin,
  async (req, res) => {
    const { status } = req.query;
    try {
      let sql = `
        SELECT
          r.id, r.user_id, u.email AS user_email, u.full_name,
          r.investment_id, i.name AS investment_name, i.asset_class,
          r.request_type, r.amount, r.notes, r.metadata,
          r.status, r.created_at, r.updated_at,
          r.handled_by_admin, r.handled_at
        FROM investment_requests r
        JOIN users u ON u.id = r.user_id
        JOIN investments i ON i.id = r.investment_id
      `;
      const params = [];
      if (status) {
        sql += ` WHERE r.status = ?`;
        params.push(status);
      }
      sql += ` ORDER BY r.created_at DESC`;

      const [rows] = await db.query(sql, params);
      res.json(rows);
    } catch (err) {
      console.error('Fetch all requests error:', err);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }
);

/**
 * GET requests for a given user
 * GET /api/users/:userId/requests
 */
router.get('/users/:userId/requests', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const [requests] = await db.query(
      `
      SELECT
        r.id, r.request_type, r.amount, r.notes, r.metadata,
        r.status, r.created_at, r.updated_at, r.handled_by_admin, r.handled_at,
        i.id AS investment_id, i.name AS investment_name, i.asset_class
      FROM investment_requests r
      JOIN investments i ON i.id = r.investment_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      `,
      [userId]
    );
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

/**
 * POST create a new assignment request
 * POST /api/users/:userId/requests
 * Body: { investmentId, requestType, amount?, notes?, metadata? }
 */
router.post('/users/:userId/requests', auth, async (req, res) => {
  const { userId }   = req.params;
  const { investmentId, requestType, amount, notes, metadata } = req.body;

  if (!['assign','unassign'].includes(requestType)) {
    return res.status(400).json({ error: 'Invalid requestType' });
  }

  try {
    await db.query(
      `INSERT INTO investment_requests
         (user_id, investment_id, request_type, amount, notes, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, investmentId, requestType, amount || 0, notes || null, metadata || null]
    );
    res.status(201).json({ message: 'Request created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

/**
 * PUT update an existing pending request
 * PUT /api/users/:userId/requests/:reqId
 * Body: { requestType, amount?, notes?, metadata? }
 */
router.put('/users/:userId/requests/:reqId', auth, async (req, res) => {
  const { userId, reqId }            = req.params;
  const { requestType, amount, notes, metadata } = req.body;

  if (!['assign','unassign'].includes(requestType)) {
    return res.status(400).json({ error: 'Invalid requestType' });
  }

  try {
    const [existing] = await db.query(
      `SELECT id FROM investment_requests
       WHERE id = ? AND user_id = ? AND status = 'Pending'`,
      [reqId, userId]
    );
    if (!existing.length) {
      return res.status(404).json({ error: 'No pending request found' });
    }

    await db.query(
      `UPDATE investment_requests
       SET request_type = ?, amount = ?, notes = ?, metadata = ?, updated_at = NOW()
       WHERE id = ?`,
      [requestType, amount || 0, notes || null, metadata || null, reqId]
    );
    res.json({ message: 'Request updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

/**
 * DELETE cancel a pending request
 * DELETE /api/users/:userId/requests/:reqId
 */
router.delete('/users/:userId/requests/:reqId', auth, async (req, res) => {
  const { userId, reqId } = req.params;
  try {
    const [match] = await db.query(
      `SELECT id FROM investment_requests
       WHERE id = ? AND user_id = ? AND status='Pending'`,
      [reqId, userId]
    );
    if (!match.length) {
      return res.status(404).json({ error: 'No pending request found' });
    }
    await db.query(`DELETE FROM investment_requests WHERE id = ?`, [reqId]);
    res.json({ message: 'Request canceled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

/**
 * PATCH approve or reject a request (admin only)
 * PATCH /api/requests/:reqId
 * Body: { status: 'Approved'|'Rejected' }
 */
router.patch('/requests/:reqId', auth, isAdmin, async (req, res) => {
  const { reqId } = req.params;
  const { status } = req.body;
  if (!['Approved','Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await db.query(
      `UPDATE investment_requests
       SET status = ?, handled_by_admin = ?, handled_at = NOW(), updated_at = NOW()
       WHERE id = ?`,
      [status, req.user.id, reqId]
    );
    res.json({ message: `Request ${status.toLowerCase()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

module.exports = router;
