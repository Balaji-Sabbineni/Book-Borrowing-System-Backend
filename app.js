const express = require('express');
const body_parser = require('body-parser');


const database = require('./config/database.config');

const BookRouter = require('./routes/books.route');
const BorrowRouter = require('./routes/borrow.route');
const UserRouter = require('./routes/user.route');

const app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

app.use('/user/books', BookRouter);
app.use('/requests', BorrowRouter);
app.use('/user', UserRouter);

module.exports = app;
