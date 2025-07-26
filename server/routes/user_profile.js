const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { auth } = require('../middleware/auth');

// GET: Current user profile
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id, email, full_name, phone, role,
        date_of_birth, nationality, residential_address,
        city, state, postal_code, country,
        id_number, source_of_funds,
        bank_name, bank_account_name, bank_account_number,
        bank_branch, swift_bic, preferred_payout_method
      FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT: Update general info
router.put('/update-info', auth, async (req, res) => {
  const { full_name, phone, date_of_birth, nationality, residential_address, city, state, postal_code, country } = req.body;
  try {
    await db.query(
      `UPDATE users SET 
        full_name = ?, phone = ?, date_of_birth = ?, nationality = ?, 
        residential_address = ?, city = ?, state = ?, 
        postal_code = ?, country = ?
       WHERE id = ?`,
      [full_name, phone, date_of_birth, nationality, residential_address, city, state, postal_code, country, req.user.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT: Update email
router.put('/update-email', auth, async (req, res) => {
  const { email } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
    if (existing.length) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    await db.query('UPDATE users SET email = ? WHERE id = ?', [email, req.user.id]);
    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Email update error:', err);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// PUT: Update password
router.put('/update-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [users] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!users.length) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// PUT: Update banking details
router.put('/update-banking', auth, async (req, res) => {
  const {
    bank_name, bank_account_name, bank_account_number,
    bank_branch, swift_bic, preferred_payout_method
  } = req.body;

  try {
    await db.query(
      `UPDATE users SET 
        bank_name = ?, bank_account_name = ?, bank_account_number = ?,
        bank_branch = ?, swift_bic = ?, preferred_payout_method = ?
      WHERE id = ?`,
      [bank_name, bank_account_name, bank_account_number, bank_branch, swift_bic, preferred_payout_method, req.user.id]
    );
    res.json({ message: 'Banking details updated' });
  } catch (err) {
    console.error('Banking update error:', err);
    res.status(500).json({ error: 'Failed to update banking details' });
  }
});

module.exports = router;
