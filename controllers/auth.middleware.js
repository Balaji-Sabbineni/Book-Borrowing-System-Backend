const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    req.user = {
        _id: '66a492ddbce737d670147ddb',
        name: 'ash'
    };
    next();
};

module.exports = authMiddleware;