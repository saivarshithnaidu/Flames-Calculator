// backend/models/FlamesResult.js

const mongoose = require('mongoose');

const FlamesResultSchema = new mongoose.Schema({
    name1: { type: String, required: true },
    name2: { type: String, required: true },
    result: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FlamesResult', FlamesResultSchema);
