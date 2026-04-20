const mongoose = require('mongoose');

const StanteSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    location: { type: String, default: '' }, // City or Address
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Stante', StanteSchema);
