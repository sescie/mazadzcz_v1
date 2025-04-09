const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, isAdmin } = require('../middleware/auth');
const { generateSecurePassword, sendWelcomeEmail } = require('../utils/authHelpers');

// User Registration (Public)
router.post('/register', async (req, res) => {
  const { email, password, full_name, phone } = req.body;
  
  try {
    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      `INSERT INTO users 
      (email, password_hash, full_name, phone) 
      VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, full_name, phone]
    );
    
    res.status(201).json({ message: 'Registration successful! Awaiting admin approval.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Registration failed' });
  }
});

// User Login (Public)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await db.query(
      `SELECT id, email, password_hash, role 
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
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Create User (Protected)
router.post('/admin/users', auth, isAdmin, async (req, res) => {
  const { email, full_name, phone, role } = req.body;
  
  try {
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

module.exports = router;