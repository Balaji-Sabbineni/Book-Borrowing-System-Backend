const express = require('express');
const User = require('../controllers/user.controller');

const router = express.Router();

router.post('/', User.signupUser);
router.get('/', User.showUsers);
// router.get('/:id', User.showUser);
router.patch('/:id', User.updateUser);

module.exports = router;