// backend/routes/flames.js

const express = require('express');
const router = express.Router();
const FlamesResult = require('../models/FlamesResult');

// @route   POST /api/flames/calculate
// @desc    Save FLAMES result
// @access  Public
router.post('/calculate', async (req, res) => {
    const { name1, name2, result } = req.body;
    // Inside the POST and GET routes, log the request body and any errors.

router.post('/calculate', async (req, res) => {
    const { name1, name2, result } = req.body;
    console.log('POST /api/flames/calculate', { name1, name2, result });

    // Rest of the code...
});

router.get('/history', async (req, res) => {
    console.log('GET /api/flames/history');
    // Rest of the code...
});


    // Input validation
    if (!name1 || !name2 || !result) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Save the result to the database
        const newResult = new FlamesResult({ name1, name2, result });
        await newResult.save();

        res.json({ message: 'Result saved successfully.' });
    } catch (error) {
        console.error('Error saving to database:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/flames/history
// @desc    Get last 10 FLAMES calculations
// @access  Public
router.get('/history', async (req, res) => {
    try {
        const history = await FlamesResult.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
