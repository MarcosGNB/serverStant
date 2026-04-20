const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register (DISABLED - Users must be created by Admin)
router.post('/register', async (req, res) => {
  res.status(403).json({ message: 'El registro público está deshabilitado. Póngase en contacto con el administrador.' });
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
    res.json({ token, user: { username, role: user.role, status: user.status, logoUrl: user.logoUrl || null } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
