const bcrypt = require('bcryptjs');
const firebase = require("../config/database.config");
const User = require('../models/user.model');

exports.signup = (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(422).json({
        email: "email is required",
        password: "password is required",
      });
    }
   
   
    firebase.createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const newUser = new User({
          firebaseUid: user.uid,
          email: req.body.email,
          Firstname: req.body.Firstname,
          Lastname:req.body.Lastname,
          phonenumber:req.body.phonenumber
          // Add other fields from req.body as needed
        });
   
        newUser.save();
        return res.status(201).json({ uid: user.uid});
       
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          return res.status(500).json({ error: errorMessage });
        } else {
          return res.status(500).json({ error: errorMessage });
        }
      });
   };

// exports.showUsers = async (req, res, next) => {
//     try {
//         const { userId } = req.params;
//         const {name, email} = req.body;
//         let user;

//         if (userId) {
//             user = await User.findById(userId);
//             if(!user){
//                 return res.status(400).json({message:"User not found"});
//             }
//             return res.status(200).json(user);
//         }else{
//             const query = {};
//             if(name) {
//                 query.name = { $regex: name, $options: 'i' };
//             }
//             if(email) {
//                 query.email = { $regex: email, $options: 'i' };
//             }
//             user = await User.find(query);

//             if(user.length ===0){
//                 return res.status(401).json({message: "No users found"});
//             }
//         }
//         res.status(200).json({ message: "User retrieved successfully", user });
//     } catch (err) {
//         res.status(500).json({message:err.message});
//     }
// }
exports.signin = (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(422).json({
        email: "email is required",
        password: "password is required",
      });
    }
   
   
    firebase.signInWithEmailAndPassword(req.body.email, req.body.password)
      .then((userCredential) => {
        const user = userCredential.user;
   
   
        // Query MongoDB for user details
        User.findOne({ firebaseUid: user.uid })
          .then((mongoUser) => {
            if (!mongoUser) {
              return res.status(404).json({ error: "User not found in MongoDB" });
            }
   
   
            return res.status(200).json({
              uid: user.uid,
              email: mongoUser.email,
              Firstname: mongoUser.Firstname,
              Lastname: mongoUser.Lastname,
              phonenumber: mongoUser.phonenumber
            });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          return res.status(500).json({ error: errorMessage });
        } else {
          return res.status(500).json({ error: errorMessage });
        }
      });
   };

   exports.forgetPassword = (req, res) => {
    if (!req.body.email) {
      return res.status(422).json({ email: "email is required" });
    }
   
   
    firebase.sendPasswordResetEmail(req.body.email)
      .then(() => {
        return res.status(200).json({ status: "Password Reset Email Sent" });
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === "auth/invalid-email") {
          return res.status(500).json({ error: errorMessage });
        } else if (errorCode === "auth/user-not-found") {
          return res.status(500).json({ error: errorMessage });
        }
      });
   };
   exports.updateUser = (req, res) => {
    const { email, Firstname, Lastname, phonenumber } = req.body;
   
   
    if (!email) {
      return res.status(422).json({
        email: "email is required"
      });
    }
   
   
    User.findOneAndUpdate(
      { email: email },
      { $set: { Firstname: Firstname, Lastname: Lastname, phonenumber: phonenumber } },
      { new: true, runValidators: true }
    )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({
        message: "User updated successfully",
        user: {
          email: updatedUser.email,
          Firstname: updatedUser.Firstname,
          Lastname: updatedUser.Lastname,
          phonenumber: updatedUser.phonenumber
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
   };
   exports.updateUser = (req, res) => {
    const { email, Firstname, Lastname, phonenumber } = req.body;
   
   
    if (!email) {
      return res.status(422).json({
        email: "email is required"
      });
    }
   
   
    User.findOneAndUpdate(
      { email: email },
      { $set: { Firstname: Firstname, Lastname: Lastname, phonenumber: phonenumber } },
      { new: true, runValidators: true }
    )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
   
   
      return res.status(200).json({
        message: "User updated successfully",
        user: {
          email: updatedUser.email,
          Firstname: updatedUser.Firstname,
          Lastname: updatedUser.Lastname,
          phonenumber: updatedUser.phonenumber
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
   };
   