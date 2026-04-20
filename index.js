const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://twichtmgnb_db_user:eieaVgY8P4Wr09MC@cluster0.fxf7liv.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const restockRoutes = require('./routes/restocks');
const reportRoutes = require('./routes/reports');
const stanteRoutes = require('./routes/stantes');

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
