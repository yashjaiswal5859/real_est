const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.js');
const propertyRoutes = require('./routes/properties.js');
const authMiddleware = require('./middleware/auth.js');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Database Connection
mongoose.connect('mongodb://localhost:27017/shruti')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', authMiddleware, propertyRoutes);

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
