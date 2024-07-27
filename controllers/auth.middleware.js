const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    req.user = {
        _id: '66a496edbacfc9318ea3f469',
        name: 'ash'
    };
    next();
};

module.exports = authMiddleware;