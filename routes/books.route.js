const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book.controller');
const authMiddleware = require('../controllers/auth.middleware');

router.post('/', authMiddleware,  BookController.addBook);

router.get('/', BookController.showAllBooks);

router.get('/search', BookController.findBook);

router.patch('/:id', authMiddleware, BookController.updateBook);

router.delete('/:id', authMiddleware, BookController.deleteBook);

module.exports = router;
