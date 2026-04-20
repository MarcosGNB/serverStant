const mongoose = require('mongoose');

const RestockSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    stante: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Restock', RestockSchema);
