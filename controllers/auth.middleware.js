const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Token not authorized" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = {
            _id: decoded.userId
        };
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = authMiddleware;
