const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});

module.exports = mongoose.model('Task', TaskSchema);