const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Protect all routes
router.use(auth);

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user._id });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        purchasePrice: req.body.purchasePrice,
        salesPrice: req.body.salesPrice,
        stock: req.body.stock || {},
        userId: req.user._id
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
        if (!product) return res.status(404).json({ message: 'Product not found or access denied' });

        if (req.body.name) product.name = req.body.name;
        if (req.body.purchasePrice) product.purchasePrice = req.body.purchasePrice;
        if (req.body.salesPrice) product.salesPrice = req.body.salesPrice;
        if (req.body.stock) product.stock = req.body.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const result = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!result) return res.status(404).json({ message: 'Product not found or access denied' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
