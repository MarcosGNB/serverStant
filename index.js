const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://twichtmgnb_db_user:eieaVgY8P4Wr09MC@cluster0.fxf7liv.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas Successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error Details:');
        console.error(err);
    });

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const restockRoutes = require('./routes/restocks');
const reportRoutes = require('./routes/reports');
const stanteRoutes = require('./routes/stantes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/restocks', restockRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stantes', stanteRoutes);

app.get('/', (req, res) => {
    res.send('VapoStant API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
