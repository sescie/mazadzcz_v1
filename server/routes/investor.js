// routes/investor.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('../middleware/auth');

// Get investment requests for an investor
router.get('/:userId/requests', auth, async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT r.id, r.amount, r.status, r.created_at,
              i.name as investment_name, i.type as investment_type
       FROM investment_requests r
       JOIN investments i ON r.investment_id = i.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    res.json(requests);
  } catch (err) {
    console.error('Fetch investment requests error:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Create new investment request
router.post('/:userId/requests', auth, async (req, res) => {
  const { investmentId, amount, notes } = req.body;
  
  try {
    // Validate request
    if (!investmentId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if investment exists and is active
    const [investment] = await db.query(
      `SELECT id FROM investments WHERE id = ? AND status = 'Active'`,
      [investmentId]
    );
    
    if (investment.length === 0) {
      return res.status(400).json({ error: 'Invalid investment' });
    }
    
    // Create request
    await db.query(
      `INSERT INTO investment_requests
       (user_id, investment_id, amount, notes, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [req.params.userId, investmentId, amount, notes || null]
    );
    
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error('Create investment request error:', err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Cancel investment request
router.delete('/:userId/requests/:requestId', auth, async (req, res) => {
  try {
    const { userId, requestId } = req.params;
    
    // Check if request belongs to user
    const [request] = await db.query(
      `SELECT id FROM investment_requests 
       WHERE id = ? AND user_id = ? AND status = 'Pending'`,
      [requestId, userId]
    );
    
    if (request.length === 0) {
      return res.status(404).json({ error: 'Request not found or cannot be canceled' });
    }
    
    // Delete request
    await db.query(
      `DELETE FROM investment_requests WHERE id = ?`,
      [requestId]
    );
    
    res.json({ message: 'Request canceled successfully' });
  } catch (err) {
    console.error('Cancel investment request error:', err);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

// Get investor portfolio
router.get('/:userId/portfolio', auth, async (req, res) => {
  try {
    const [portfolio] = await db.query(
      `SELECT i.id, i.name, i.type, i.current_value,
              ui.amount, ui.purchase_date, ui.expected_return
       FROM user_investments ui
       JOIN investments i ON ui.investment_id = i.id
       WHERE ui.user_id = ? AND ui.status = 'Active'`,
      [req.params.userId]
    );
    res.json(portfolio);
  } catch (err) {
    console.error('Fetch portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get investor statements
router.get('/:userId/statements', auth, async (req, res) => {
  try {
    const [statements] = await db.query(
      `SELECT id, period_start, period_end, total_value, 
              created_at as statement_date
       FROM investor_statements
       WHERE user_id = ?
       ORDER BY period_end DESC`,
      [req.params.userId]
    );
    res.json(statements);
  } catch (err) {
    console.error('Fetch statements error:', err);
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

module.exports = router;