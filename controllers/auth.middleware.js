const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    req.user = {
        _id: '66a666acd5465fed53cc3383',
        name: 'Balaji'
    };
    next();
};

module.exports = authMiddleware;