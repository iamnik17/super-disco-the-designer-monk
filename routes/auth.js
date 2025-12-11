const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded admin credentials (in production, use database)
const ADMIN_CREDENTIALS = {
  email: 'admin@thedesignermonk.com',
  password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p02ch0Mnn9NQBYEB1jcrcpyG' // password: "admin123"
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple credential check for demo
    if (email === 'admin@thedesignermonk.com' && password === 'admin123') {
      // Generate JWT token
      const token = jwt.sign(
        { email: email, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: { email, role: 'admin' }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // In production, save to database
    // For now, just return success
    res.json({
      success: true,
      message: 'User created successfully',
      user: { email, role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify route
router.get('/verify', verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;