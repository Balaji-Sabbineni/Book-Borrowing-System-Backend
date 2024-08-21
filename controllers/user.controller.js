const jwt = require('jsonwebtoken');
const firebase = require("../config/database.config");
const User = require('../models/user.model');
require('dotenv').config();
const Book = require('../models/book.model');

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
        Lastname: req.body.Lastname,
        phonenumber: req.body.phonenumber,
        password: req.body.password
        // Add other fields from req.body as needed
      });
      newUser.save();
      return res.status(201).json({ FireBaseUserId: user.uid, userId: newUser._id });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === "auth/weak-password") {
        return res.status(501).json({ error: errorMessage });
      } else {
        return res.status(500).json({ error: errorMessage });
      }
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      email: "email is required",
      password: "password is required",
    });
  }
  firebase.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      User.findOne({ firebaseUid: user.uid })
        .then((mongoUser) => {
          if (!mongoUser) {
            return res.status(404).json({ error: "User not found in MongoDB" });
          }
          const token = jwt.sign(
            { userId: mongoUser._id },
            process.env.KEY,
            { expiresIn: '1h' }
          );
          // res.setHeader('Authorization', `Bearer ${token}`);
          return res.status(200).json({
            message: "User Login Successful!",
            token: token,
            userDetails: {
              FireBaseUserId: user.uid,
              MongoDBUserId: mongoUser._id,
              email: mongoUser.email,
              Firstname: mongoUser.Firstname,
              Lastname: mongoUser.Lastname,
              phonenumber: mongoUser.phonenumber
            }
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
    { email: {$eq: email} },
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

exports.getCurrentUser = (req, res) => {
  const { id } = req.params;

  User.findOne({ _id: { $eq: id } })
    .populate('books.book', '_id title')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const booksWithDetails = Promise.all(
        user.books.map(async (bookItem) => {
          const book = Book.findById(bookItem.book);
          return {
            title: book ? book.title : 'Unknown Title', // Handle case where book may not be found
            status: bookItem.status,
            _id: bookItem.book,
          };
        })
      );

      // Return the user data along with books
      const response = {
        _id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        books: booksWithDetails,
      };
      return res.status(200).json(user);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.findOneAndDelete({ _id: { $eq: id } })
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({
        message: "User deleted successfully"
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};
