const express = require('express');
const router = express.Router();
const Stante = require('../models/Stante');
const { auth } = require('../middleware/auth');

// Protect all routes
router.use(auth);

// GET all stantes (Only for current user)
router.get('/', async (req, res) => {
    try {
        const stantes = await Stante.find({ userId: req.user._id });
        res.json(stantes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new stante
router.post('/', async (req, res) => {
    const stante = new Stante({
        name: req.body.name,
        location: req.body.location,
        userId: req.user._id // Assign to current user
    });

    try {
        const newStante = await stante.save();
        res.status(201).json(newStante);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE stante
router.delete('/:id', async (req, res) => {
    try {
        // Ensure user owns the stante before deleting
        const result = await Stante.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!result) return res.status(404).json({ message: 'Sucursal no encontrada o no tienes permisos' });
        res.json({ message: 'Stante deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
