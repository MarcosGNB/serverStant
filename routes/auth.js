const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if first user to make admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = new User({ username, password, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mgnb_vapo_secret', { expiresIn: '30d' });
    res.status(201).json({ token, user: { username, role, status: user.status } });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar usuario. El nombre de usuario podría estar en uso.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'bloqueado temporalmente por motivos de licencia mgnb' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mgnb_vapo_secret', { expiresIn: '30d' });
    res.json({ token, user: { username, role: user.role, status: user.status } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
