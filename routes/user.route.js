const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');
const authMiddleware = require('../controllers/auth.middleware');

const {
    signup,
    signin,
    forgetPassword,
    updateUser,
    deleteUser,
    getCurrentUser
} = require("../controllers/user.controller");


router.post("/signup", signup);
router.get('/:id', authMiddleware, getCurrentUser);

router.post("/signin", signin);
//router.get('/', User.showUsers);

router.post("/forget-password", forgetPassword);
router.put('/updateUser/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);


module.exports = router;
