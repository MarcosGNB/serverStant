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

        const stanteName = result.name;
        const [Sale, Restock, Product] = [require('../models/Sale'), require('../models/Restock'), require('../models/Product')];
        
        // Delete history
        await Sale.deleteMany({ stante: stanteName, userId: req.user._id });
        await Restock.deleteMany({ stante: stanteName, userId: req.user._id });

        // Unset product stock
        const unsetQuery = {};
        unsetQuery[`stock.${stanteName}`] = "";
        await Product.updateMany({ userId: req.user._id }, { $unset: unsetQuery });

        res.json({ message: 'Stante and associated data deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
