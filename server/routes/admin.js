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

module.exports = router;