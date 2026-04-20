const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Restock = require('../models/Restock');
const { auth } = require('../middleware/auth');

// Protect all routes
router.use(auth);

// GET summary report by date range
router.get('/summary', async (req, res) => {
    const { from, to } = req.query;
    
    if (!from || !to) {
        return res.status(400).json({ message: 'Please provide both from and to dates' });
    }

    try {
        const query = {
            userId: req.user._id,
            createdAt: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        };

        const sales = await Sale.find(query).populate('product');

        let totalRevenue = 0;
        let totalCost = 0;
        let totalProfit = 0;
        const productStats = {};

        sales.forEach(sale => {
            const revenue = sale.total;
            const cost = sale.purchasePrice * sale.quantity;
            const profit = revenue - cost;

            totalRevenue += revenue;
            totalCost += cost;
            totalProfit += profit;

            const prodName = sale.product ? sale.product.name : 'Deleted Product';
            if (!productStats[prodName]) {
                productStats[prodName] = { revenue: 0, cost: 0, profit: 0, quantity: 0 };
            }
            productStats[prodName].revenue += revenue;
            productStats[prodName].cost += cost;
            productStats[prodName].profit += profit;
            productStats[prodName].quantity += sale.quantity;
        });

        res.json({
            summary: {
                totalRevenue,
                totalCost,
                totalProfit
            },
            details: productStats,
            count: sales.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET report for a specific stante
router.get('/stante/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const query = { stante: name, userId: req.user._id };
        const sales = await Sale.find(query).populate('product').sort({ createdAt: -1 });
        const restocks = await Restock.find(query).populate('product').sort({ createdAt: -1 });

        let totalRevenue = 0;
        let totalCost = 0;
        let totalProfit = 0;

        sales.forEach(sale => {
            const rev = sale.total;
            const cost = sale.purchasePrice * sale.quantity;
            totalRevenue += rev;
            totalCost += cost;
            totalProfit += (rev - cost);
        });

        res.json({
            summary: {
                totalRevenue,
                totalCost,
                totalProfit
            },
            sales,
            restocks
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
