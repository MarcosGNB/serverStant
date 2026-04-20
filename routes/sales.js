const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// GET all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find().populate('product').sort({ createdAt: -1 });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new sale
router.post('/', async (req, res) => {
    const { productId, quantity, stante } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const currentStock = product.stock.get(stante) || 0;
        if (currentStock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock in this stante' });
        }

        // Deduct stock
        product.stock.set(stante, currentStock - quantity);
        await product.save();

        // Create Sale record
        const sale = new Sale({
            product: productId,
            quantity: quantity,
            stante: stante,
            purchasePrice: product.purchasePrice,
            salesPrice: product.salesPrice,
            total: product.salesPrice * quantity
        });

        const newSale = await sale.save();
        res.status(201).json(newSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
