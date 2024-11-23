const express = require('express');
const router = express.Router();
const FlamesResult = require('../models/FlamesResult');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// @route   POST /api/flames/calculate
// @desc    Save FLAMES result
// @access  Private
router.post('/calculate', authenticate, async (req, res) => {
    const { name1, name2, result } = req.body;

    if (!name1 || !name2 || !result) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newResult = new FlamesResult({
            name1,
            name2,
            result,
            user: req.user.id, // Associate result with logged-in user
        });

        await newResult.save();
        res.json({ message: 'Result saved successfully.' });
    } catch (error) {
        console.error('Error saving to database:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/flames/history
// @desc    Get user's FLAMES history
// @access  Private
router.get('/history', authenticate, async (req, res) => {
    try {
        const history = await FlamesResult.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/flames/history
// @desc    Delete user's FLAMES history
// @access  Private
router.delete('/history', authenticate, async (req, res) => {
    try {
        await FlamesResult.deleteMany({ user: req.user.id });
        res.json({ message: 'History deleted successfully.' });
    } catch (error) {
        console.error('Error deleting history:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
