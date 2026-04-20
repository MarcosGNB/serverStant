const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Restock = require('../models/Restock');
const Stante = require('../models/Stante');
const { auth, admin } = require('../middleware/auth');

// Protected Admin Routes
router.use(auth, admin);

// List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Create a new user (via Admin)
router.post('/users', async (req, res) => {
  try {
    const { username, password, logoUrl } = req.body;
    const user = new User({ username, password, logoUrl: logoUrl || null });
    await user.save();
    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear usuario' });
  }
});

// Update user logo
router.patch('/users/:id/logo', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.logoUrl = req.body.logoUrl || null;
    await user.save();
    res.json({ message: 'Logo actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar logo' });
  }
});

// Toggle user status (Block/Active)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
});

// Delete user (Cascading Wipe)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Cascading Delete: Delete all data associated with this user
    await Promise.all([
      Stante.deleteMany({ userId }),
      Product.deleteMany({ userId }),
      Sale.deleteMany({ userId }),
      Restock.deleteMany({ userId })
    ]);
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Usuario y todos sus datos han sido eliminados permanentemente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
