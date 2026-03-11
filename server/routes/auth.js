// ============================================================
// Auth Routes
// ============================================================
// POST /api/auth/signup  — Register a new user
// POST /api/auth/login   — Log in and receive a JWT
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// ---- Signup with input validation ----
router.post(
    '/signup',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    signup
);

// ---- Login with input validation ----
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    login
);

module.exports = router;
