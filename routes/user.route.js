const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');
const authMiddleware = require('../controllers/auth.middleware');

const {
    signup,
    signin,
    forgetPassword,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");


router.post("/signup", signup);
router.get('/protected', authMiddleware, (req, res) =>{
    res.status(200).json({message:"protected route accessed", id: req.user._id});
});

router.post("/signin", signin);
//router.get('/', User.showUsers);

router.post("/forget-password", forgetPassword);
router.put('/updateUser', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);


module.exports = router;
