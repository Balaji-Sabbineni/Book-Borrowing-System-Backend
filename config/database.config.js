const mongoose = require('mongoose');
const { initializeApp } = require("firebase/app");
//const { getAuth } = require("firebase/auth");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require("firebase/auth");
//const { getFirestore } = require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyB_HRWFM9Dp9Hp3yQZL3_VqOizep1DxsKc",
  authDomain: "book-management-33f91.firebaseapp.com",
  projectId: "book-management-33f91",
  storageBucket: "book-management-33f91.appspot.com",
  messagingSenderId: "931381765311",
  appId: "1:931381765311:web:d9f7a328b04fc8a057120a",
  measurementId: "G-D6RVL1CL58"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Auth and Firestore
const auth = getAuth(app);
//const db = getFirestore(app);
const connectionString = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.7zfjhjz.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;

const database = mongoose.connect(connectionString)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.error('Mongodb connection error:', err
));

module.exports = {
  createUserWithEmailAndPassword: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  signInWithEmailAndPassword: (email, password) => signInWithEmailAndPassword(auth, email, password),
  sendPasswordResetEmail: (email) => sendPasswordResetEmail(auth, email)
 };
module.exports.database = database;