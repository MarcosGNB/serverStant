const express = require('express');
const router = express.Router();
const Stante = require('../models/Stante');

// GET all stantes
router.get('/', async (req, res) => {
    try {
        const stantes = await Stante.find();
        res.json(stantes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new stante
router.post('/', async (req, res) => {
    const stante = new Stante({
        name: req.body.name,
        location: req.body.location
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
        await Stante.findByIdAndDelete(req.params.id);
        res.json({ message: 'Stante deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
