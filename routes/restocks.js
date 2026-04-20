const express = require('express');
const router = express.Router();
const Restock = require('../models/Restock');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Protect all routes
router.use(auth);

// GET all restocks
router.get('/', async (req, res) => {
    try {
        const restocks = await Restock.find({ userId: req.user._id }).populate('product').sort({ createdAt: -1 });
        res.json(restocks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new restock
router.post('/', async (req, res) => {
    const { productId, quantity, stante } = req.body;

    try {
        const product = await Product.findOne({ _id: productId, userId: req.user._id });
        if (!product) return res.status(404).json({ message: 'Product not found or access denied' });

        // Increase stock
        const currentStock = product.stock.get(stante) || 0;
        product.stock.set(stante, currentStock + quantity);
        await product.save();

        // Create Restock record
        const restock = new Restock({
            product: productId,
            quantity: quantity,
            stante: stante,
            userId: req.user._id
        });

        const newRestock = await restock.save();
        res.status(201).json(newRestock);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
