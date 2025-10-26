const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple in-memory user storage (use database in production)
const users = [
    {
        id: 1,
        username: 'admin',
        // Password: "admin123" - hashed
        password: '$2a$10$8K1p/a0dRTlB0s7.8Fw.8u8F8w8e8F8w8e8F8w8e8F8w8e8F8w8e'
    }
];

const JWT_SECRET = 'your-secret-key-here'; // Change this in production!

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
