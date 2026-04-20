const mongoose = require('mongoose');

const StanteSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, default: '' }, // City or Address
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Stante', StanteSchema);
