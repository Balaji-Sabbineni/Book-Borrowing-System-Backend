const mongoose = require('mongoose');

const connectionString = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.7zfjhjz.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;

const database = mongoose.connect(connectionString)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.error('Mongodb connection error:', err
));

module.exports.database = database;