// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());// Enable CORS for all origins
// Alternatively, restrict to specific origin
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json()); // Parse JSON bodies
// Add this middleware before routes to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flames-calculator';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
});

// Routes
const flamesRoutes = require('./routes/flames');
app.use('/api/flames', flamesRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('🔥 FLAMES Calculator API is running!');
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
