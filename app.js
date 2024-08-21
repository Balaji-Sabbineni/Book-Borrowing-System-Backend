const express = require('express');
const body_parser = require('body-parser');

const database = require('./config/database.config');

const BookRouter = require('./routes/books.route');
const BorrowRouter = require('./routes/borrow.route');
const UserRouter = require('./routes/user.route');

const app = express();

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

app.get('/:path', function(req, res) {
  let path = req.params.path;
  try {
    // Resolve the file path and verify it is under the root directory
    filePath = fs.realpathSync(path.resolve(ROOT, filePath));
    if (!filePath.startsWith(ROOT)) {
      res.status(403).send('Access denied');
      return;
    }
    res.sendFile(filePath);
  } catch (error) {
    res.status(400).send('Invalid path');
  }
});

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

app.use('/user/books', BookRouter);
app.use('/requests', BorrowRouter);
app.use('/user', UserRouter);

module.exports = app;
