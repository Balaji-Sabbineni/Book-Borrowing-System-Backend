const express = require('express');
const body_parser = require('body-parser');

const database = require('./config/database.config');

const BookRouter = require('./routes/books.route');

const app = express();

app.use(body_parser.json());

app.use('/books', BookRouter);

module.exports = app;
