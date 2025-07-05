const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, isAdmin } = require('../middleware/auth');
const { generateSecurePassword, sendWelcomeEmail } = require('../utils/authHelpers');
const pool = require('../db');
const multer  = require('multer');

// User Registration (Public)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}_${file.fieldname}.${ext}`);
  }
});
const upload = multer({ storage });

// server/routes/users.js
router.post(
  '/register',
  upload.fields([
    { name: 'id_document',       maxCount: 1 },
    { name: 'proof_of_address',  maxCount: 1 }  // still optional
  ]),
  async (req, res) => {
    // 2.1) Pull out all the fields we want
    const {
      email, password, full_name, phone,
      date_of_birth, nationality, residential_address,
      city, state, postal_code, country,
      id_number, source_of_funds, terms_accepted,
      bank_name, bank_account_name, bank_account_number,
      bank_branch, swift_bic, preferred_payout_method
    } = req.body;

    console.log(terms_accepted);

    // 2.2) Basic “required” validations
    const missing = [];
    ['email','password','full_name','terms_accepted']
      .forEach(f => { if (!req.body[f]) missing.push(f); });
    if (missing.length) {
      return res
        .status(400)
        .json({ error: 'Missing required fields', details: missing });
    }

    // 2.3) Format checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }
    if (terms_accepted !== true) {
      return res.status(400).json({
        error: 'You must accept the terms and conditions'
      });
    }

    // 2.4) File upload paths (multer populates req.files)
    const idDocPath  = req.files?.id_document?.[0]?.path       || null;
    const proofPath  = req.files?.proof_of_address?.[0]?.path  || null;

    try {
      // 2.5) Grab a connection and start a transaction
      const conn = await pool.getConnection();
      await conn.beginTransaction();

      // 2.6) Email uniqueness check
      const [existing] = await conn.query(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      if (existing.length) {
        await conn.rollback();
        return res.status(409).json({
          error: 'Email already registered',
          resolution: 'Use a different email or log in'
        });
      }

      // 2.7) Hash the password (bcrypt with salt rounds = 10)
      const passwordHash = await bcrypt.hash(password, 10);

      // 2.8) Insert into users (role & kyc_status default to 'pending')
      const insertSql = `
        INSERT INTO users (
          email, password_hash, full_name, phone,
          date_of_birth, nationality, residential_address,
          city, state, postal_code, country,
          id_number, id_document_path, proof_of_address_path,
          source_of_funds, terms_accepted,
          bank_name, bank_account_name, bank_account_number,
          bank_branch, swift_bic, preferred_payout_method
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const params = [
        email, passwordHash, full_name, phone,
        date_of_birth || null, nationality || null, residential_address || null,
        city || null, state || null, postal_code || null, country || null,
        id_number || null, idDocPath,   proofPath,
        source_of_funds || null, 1,      // terms_accepted stored as tinyint
        bank_name   || null,
        bank_account_name   || null,
        bank_account_number || null,
        bank_branch || null,
        swift_bic   || null,
        preferred_payout_method || null
      ];
      const [result] = await conn.query(insertSql, params);

      // 2.9) Commit & release
      await conn.commit();
      conn.release();

      // 2.10) Return success
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Awaiting admin approval.',
        userId: result.insertId
      });

    } catch (err) {
      console.error('Registration error:', err);
      // If something went wrong, rollback if possible
      if (err && err.connection) {
        try { await err.connection.rollback(); } catch {}
      }
      return res.status(500).json({
        error: 'Registration failed, please try again later'
      });
    }
  }
);
// User Login (Public)
router.post('/login', async (req, res) => {

  const { email, password } = req.body;
  
  try {
    const [rows] = await db.query(
      `SELECT id, email, password_hash, role, full_name, phone
       FROM users WHERE email = ?`,
      [email]
    );
    
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all users (Admin only)
// routes/users.js
router.get('/admin/users', auth, isAdmin, async (req, res) => {
  console.log('GET /admin/users endpoint hit'); // Debug log
  try {
    const [users] = await db.query(
      `SELECT 
        id, 
        email, 
        full_name, 
        phone, 
        role, 
        created_at,
        created_by_admin,
        is_active  
       FROM users ORDER BY created_at DESC`
    );
    console.log('Users found:', users.length); // Debug log
    res.json(users);
  } catch (err) {
    console.error('Error:', err); // Debug log
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user by ID (Admin only)
router.get('/admin/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id, 
        email, 
        full_name, 
        phone, 
        role, 
        created_at,
        created_by_admin,
        is_active
       FROM users
       WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Admin Create User (Protected)
router.post('/admin/users', auth, isAdmin, async (req, res) => {
  const { email, full_name, phone, role } = req.body;
  
  try {
    // Validate required fields
    if (!email || !full_name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tempPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await db.query(
      `INSERT INTO users 
      (email, password_hash, full_name, phone, role, created_by_admin) 
      VALUES (?, ?, ?, ?, ?, TRUE)`,
      [email, hashedPassword, full_name, phone, role]
    );

    await sendWelcomeEmail(email, tempPassword);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Admin user creation error:', err);
    res.status(500).json({ error: err.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'User creation failed' });
  }
});

// Update user (Admin only)
router.put('/admin/users/:id', auth, isAdmin, async (req, res) => {
  const { full_name, phone, role, is_active } = req.body;
  
  try {
    await db.query(
      `UPDATE users 
       SET full_name = ?, phone = ?, role = ?, is_active = ?
       WHERE id = ?`,
      [full_name, phone, role, is_active, req.params.id]
    );
    
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete(
  '/admin/users/:id',
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.query(
        `DELETE FROM users
         WHERE id = ?`,
        [id]
      );
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

// Activate user (Admin only)
router.patch(
  '/admin/users/:id/activate',
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.query(
        `UPDATE users
         SET is_active = TRUE
         WHERE id = ?`,
        [id]
      );
      res.json({ message: 'User activated successfully' });
    } catch (err) {
      console.error('Activate user error:', err);
      res.status(500).json({ error: 'Failed to activate user' });
    }
  }
);

// Deactivate user (Admin only)
router.patch(
  '/admin/users/:id/deactivate',
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.query(
        `UPDATE users
         SET is_active = FALSE
         WHERE id = ?`,
        [id]
      );
      res.json({ message: 'User deactivated successfully' });
    } catch (err) {
      console.error('Deactivate user error:', err);
      res.status(500).json({ error: 'Failed to deactivate user' });
    }
  }
);

// Reset user password (Admin only)
router.post(
  '/admin/users/:id/reset-password',
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const newPassword = generateSecurePassword();
      const hash = await bcrypt.hash(newPassword, 10);

      await db.query(
        `UPDATE users
         SET password_hash = ?
         WHERE id = ?`,
        [hash, id]
      );

      // re-use your welcome email util, or swap in a reset‑specific one
      await sendWelcomeEmail(
        /* pass: */ newPassword
      );

      res.json({ message: 'Password reset and emailed to user' });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
);

// “Who am I?” (Get current user profile)
router.get(
  '/users/me',
  auth,
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT 
           id, email, full_name, phone, role,
           is_active, last_login
         FROM users
         WHERE id = ?`,
        [req.user.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Get profile error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
);

module.exports = router;