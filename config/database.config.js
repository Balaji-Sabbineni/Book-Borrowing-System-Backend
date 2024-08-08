const mongoose = require('mongoose');
const { initializeApp } = require("firebase/app");
//const { getAuth } = require("firebase/auth");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require("firebase/auth");
//const { getFirestore } = require("firebase/firestore");


const firebaseConfig = {
  apiKey: process.env.firebase_api_key,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messaging_sender_id,
  appId: process.env.appId,
  measurementId: process.env.measurementId
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