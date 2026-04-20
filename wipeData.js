const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Restock = require('./models/Restock');
const Stante = require('./models/Stante');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://twichtmgnb_db_user:eieaVgY8P4Wr09MC@cluster0.fxf7liv.mongodb.net/?appName=Cluster0';

async function fullReset() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('--- Conectado a MongoDB para REINICIO TOTAL ---');

    // 1. Borrar TODO
    await Promise.all([
      Stante.deleteMany({}),
      Product.deleteMany({}),
      Sale.deleteMany({}),
      Restock.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('✅ Base de datos vaciada por completo.');

    // 2. Crear Admin Maestro
    const adminUser = new User({
      username: 'admin',
      password: 'mgnb2025',
      role: 'admin',
      status: 'active'
    });

    await adminUser.save();
    console.log('✅ Usuario ADMIN creado exitosamente (admin / mgnb2025).');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error durante el reinicio:', err);
    process.exit(1);
  }
}

fullReset();
