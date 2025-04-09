const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, isAdmin } = require('../middleware/auth');

// Create Investment (Admin Only)
router.post('/', auth, isAdmin, async (req, res) => {
  const { name, type, isin, risk_level, price, total_units } = req.body;
  
  try {
    // Validate required fields
    if (!name || !type || !isin || !price || !total_units) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.query(
      `INSERT INTO investments 
      (name, type, isin, risk_level, price, total_units)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [name, type, isin, risk_level, price, total_units]
    );
    
    res.status(201).json({ message: 'Investment created successfully' });
  } catch (err) {
    console.error('Investment creation error:', err);
    res.status(500).json({ error: err.code === 'ER_DUP_ENTRY' ? 'ISIN already exists' : 'Investment creation failed' });
  }
});

// Get All Investments (Authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const [investments] = await db.query(
      `SELECT id, name, type, isin, price AS current_price 
       FROM investments`
    );
    res.json(investments);
  } catch (err) {
    console.error('Fetch investments error:', err);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

module.exports = router;