const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "error.message" });
    }
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
