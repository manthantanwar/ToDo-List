const mongoose = require('mongoose');
const id = mongoose.Schema.Types.ObjectId

const Todo = new mongoose.Schema({
    userId: {
        type: id,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["done", "pending", "in progress", "completed"],
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Todo', Todo);