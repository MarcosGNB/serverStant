const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    stante: { type: String, required: true },
    purchasePrice: { type: Number, required: true }, // Saved at time of sale for profit calculation
    salesPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);
