// ============================================================
// Auth Middleware
// ============================================================
// Protects routes by verifying the JWT token sent in the
// Authorization header. If valid, attaches the user's id
// to req.user so downstream handlers can use it.
// ============================================================

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Expect header format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token and extract payload ({ id: userId })
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: '...', iat: ..., exp: ... }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
