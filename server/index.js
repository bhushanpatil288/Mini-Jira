// ============================================================
// Mini Jira — Express Server Entry Point
// ============================================================
// This file boots the Express app, connects to MongoDB, and
// registers all middleware + route handlers.
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import route modules
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');

const app = express();

// ---- Middleware ----
// Allow requests from the Vite dev server (port 5173 by default)
app.use(cors({ origin: ['http://localhost:5173', 'https://mini-jira-1.onrender.com'], credentials: true }));
app.use(express.json()); // Parse JSON request bodiesapp.use(cookieParser());

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

// ---- Health check ----
app.get('/', (_req, res) => res.json({ message: 'Mini Jira API is running 🚀' }));

// ---- Global Error Handler ----
// Any error thrown in a route/middleware ends up here.
// We send a consistent JSON shape so the frontend can rely on it.
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// ---- Connect to MongoDB and start listening ----
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
