const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    req.user = {
        _id: '66a911e08cfeae8c0e1e8b90',
        name: 'ashritha'
    };
    next();
};

module.exports = authMiddleware;