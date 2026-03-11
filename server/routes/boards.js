// ============================================================
// Board Routes
// ============================================================
// All routes are protected — user must be logged in.
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
    createBoard,
    getBoards,
    getBoardById,
    addMember,
} = require('../controllers/boardController');

const router = express.Router();

// All board routes require authentication
router.use(auth);

// GET  /api/boards        — List user's boards
router.get('/', getBoards);

// GET  /api/boards/:id    — Get single board
router.get('/:id', getBoardById);

// POST /api/boards        — Create a new board
router.post(
    '/',
    [body('name').trim().notEmpty().withMessage('Board name is required')],
    createBoard
);

// PUT  /api/boards/:id/members — Add a member by email
router.put(
    '/:id/members',
    [body('email').isEmail().withMessage('Valid email is required')],
    addMember
);

module.exports = router;
