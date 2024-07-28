const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    req.user = {
        _id: '66a4b223488301dc35595f39',
        name: 'balu'
    };
    next();
};

module.exports = authMiddleware;