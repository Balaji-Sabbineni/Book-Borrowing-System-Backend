const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');
const BookController = require('../controllers/book.controller');

router.post('/', BookController.addBook);

router.get('/', BookController.showAllBooks);

// router.get('/search', async (req, res, next) => {
//     try {
//         const { title, author, genre } = req.query;

//         if (!title || !author || !genre) {
//             return res.status(400).json({ message: 'Search query cannot be empty' });
//         }

//         const searchConditions = [];
//         if (title) searchConditions.push({ title: { $regex: title, $options: 'i' } });
//         if (author) searchConditions.push({ author: { $regex: author, $options: 'i' } });
//         if (genre) searchConditions.push({ genre: { $regex: genre, $options: 'i' } });

//         const books = await Book.find({ $or: searchConditions });

//         res.status(200).json(books);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.get('/:id', BookController.findBook);

router.patch('/:id', BookController.updateBook);

router.delete('/:id', BookController.deleteBook);

module.exports = router;
