const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

exports.signupUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered succesfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.showUsers = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const {name, email} = req.body;
        let user;

        if (userId) {
            user = await User.findById(userId);
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            return res.status(200).json(user);
        }else{
            const query = {};
            if(name) {
                query.name = { $regex: name, $options: 'i' };
            }
            if(email) {
                query.email = { $regex: email, $options: 'i' };
            }
            user = await User.find(query);

            if(user.length ===0){
                return res.status(401).json({message: "No users found"});
            }
        }
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (err) {
        res.status(500).json({message:err.message});
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.params.id;
        const UpdateData = {name, email};
        if(password){
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            UpdateData.password = hashedPassword;
        }
        const updatedUser = await User.findByIdAndUpdate(userId, UpdateData, { new: true });
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};