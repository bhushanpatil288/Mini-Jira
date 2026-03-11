// ============================================================
// Task Routes
// ============================================================
// All routes are protected — user must be logged in.
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
    getTasksByBoard,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// All task routes require authentication
router.use(auth);

// GET    /api/tasks/:boardId — Get all tasks for a board
router.get('/:boardId', getTasksByBoard);

// POST   /api/tasks          — Create a new task
router.post(
    '/',
    [body('title').trim().notEmpty().withMessage('Task title is required')],
    createTask
);

// PUT    /api/tasks/:id      — Update a task (status, title, etc.)
router.put('/:id', updateTask);

// DELETE /api/tasks/:id      — Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
