const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    salesPrice: { type: Number, required: true },
    // Stock distributed by "stante" (shelf name/id)
    // Example: { "Shelf A": 10, "Shelf B": 5 }
    stock: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

// Total stock virtual
ProductSchema.virtual('totalStock').get(function() {
    let total = 0;
    this.stock.forEach((qty) => {
        total += qty;
    });
    return total;
});

module.exports = mongoose.model('Product', ProductSchema);
