const mongoose = require('mongoose');
// firebase.js
const { initializeApp } = require("firebase/app");
//const { getAuth } = require("firebase/auth");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require("firebase/auth");
//const { getFirestore } = require("firebase/firestore");


const firebaseConfig = {
 apiKey: "AIzaSyDFYIRq_zkruRqDrEWna_Csx2nzGvQC1Tc",
 authDomain: "book-borrowing-system-c8d39.firebaseapp.com",
 projectId: "book-borrowing-system-c8d39",
 storageBucket: "book-borrowing-system-c8d39.appspot.com",
 messagingSenderId: "537433965255",
 appId: "1:537433965255:web:3a4bcef373bdd6b419f4e2",
 measurementId: "G-F7PRSVZH7D"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Auth and Firestore
const auth = getAuth(app);
//const db = getFirestore(app);
const connectionString = `mongodb+srv://ashritha:jTE3AZUFhPpeye9y@cluster0.ldboehq.mongodb.net/book-management?retryWrites=true&w=majority&appName=Cluster0`;

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