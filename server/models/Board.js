// ============================================================
// Board Model
// ============================================================
// A board is a workspace that contains tasks. Each board has
// an owner and optional members who can view/edit tasks.
// ============================================================

const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Board name is required'],
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Members who have access to this board (besides the owner)
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
