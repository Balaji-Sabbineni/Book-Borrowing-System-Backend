const mongoose = require('mongoose');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require("firebase/auth");


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
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