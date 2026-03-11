// ============================================================
// Board Controller
// ============================================================
// Handles creating boards, fetching user's boards, and
// adding members to a board by email.
// ============================================================

const { validationResult } = require('express-validator');
const Board = require('../models/Board');
const User = require('../models/User');

// ---- POST /api/boards — Create a new board ----
const createBoard = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const board = await Board.create({
            name: req.body.name,
            owner: req.user.id, // From auth middleware
        });

        res.status(201).json(board);
    } catch (err) {
        res.status(500).json({ message: 'Error creating board' });
    }
};

// ---- GET /api/boards — Get all boards the user owns or is a member of ----
const getBoards = async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id },
            ],
        })
            .populate('owner', 'name email')    // Include owner's name & email
            .populate('members', 'name email')  // Include members' names & emails
            .sort({ createdAt: -1 });           // Newest first

        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching boards' });
    }
};

// ---- GET /api/boards/:id — Get a single board by ID ----
const getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Only owner or members can access
        const isOwner = board.owner._id.toString() === req.user.id;
        const isMember = board.members.some((m) => m._id.toString() === req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(board);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching board' });
    }
};

// ---- PUT /api/boards/:id/members — Add a member by email ----
const addMember = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Only the owner can add members
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the board owner can add members' });
        }

        // Find the user to add by email
        const userToAdd = await User.findOne({ email: req.body.email });
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found with that email' });
        }

        // Don't add the owner as a member
        if (userToAdd._id.toString() === board.owner.toString()) {
            return res.status(400).json({ message: 'Owner is already on the board' });
        }

        // Don't add duplicates
        if (board.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        board.members.push(userToAdd._id);
        await board.save();

        // Return updated board with populated fields
        const updatedBoard = await Board.findById(board._id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        res.json(updatedBoard);
    } catch (err) {
        res.status(500).json({ message: 'Error adding member' });
    }
};

module.exports = { createBoard, getBoards, getBoardById, addMember };
