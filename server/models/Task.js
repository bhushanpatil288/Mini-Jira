// ============================================================
// Task Model
// ============================================================
// A task belongs to a board and moves through three statuses:
// Todo → InProgress → Done (drag-and-drop on the frontend).
// ============================================================

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        // The three columns on the scrum board
        status: {
            type: String,
            enum: ['Todo', 'InProgress', 'Done'],
            default: 'Todo',
        },
        // Which board this task belongs to
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board',
            required: true,
        },
        // The user this task is assigned to (optional)
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // The user who created this task
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
