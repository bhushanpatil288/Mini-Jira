// ============================================================
// Task Controller
// ============================================================
// CRUD operations for tasks. All actions check that the user
// has access to the board the task belongs to.
// ============================================================

const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Board = require('../models/Board');

// Helper: check if a user has access to a board
const hasAccess = (board, userId) => {
    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some((m) => m.toString() === userId);
    return isOwner || isMember;
};

// ---- GET /api/tasks/:boardId — Get all tasks for a board ----
const getTasksByBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        if (!hasAccess(board, req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Fetch tasks and populate user info for display
        const tasks = await Task.find({ board: req.params.boardId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// ---- POST /api/tasks — Create a new task ----
const createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { title, description, board: boardId, assignedTo } = req.body;

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        if (!hasAccess(board, req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const task = await Task.create({
            title,
            description,
            board: boardId,
            assignedTo: assignedTo || null,
            createdBy: req.user.id,
        });

        // Return with populated references
        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json(populatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

// ---- PUT /api/tasks/:id — Update a task (title, description, status, assignedTo) ----
// This is used for drag-and-drop (status change) and editing task details.
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const board = await Board.findById(task.board);
        if (!hasAccess(board, req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Only update the fields that were provided
        const { title, description, status, assignedTo } = req.body;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

// ---- DELETE /api/tasks/:id — Delete a task ----
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const board = await Board.findById(task.board);
        if (!hasAccess(board, req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

module.exports = { getTasksByBoard, createTask, updateTask, deleteTask };
