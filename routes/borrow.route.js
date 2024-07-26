const express = require('express');

const router = express.Router();

const BorrowController = require('../controllers/borrow.controller');
const Book = require('../models/book.model');

// router.post('/', async (req, res, next) => {
//     const { bookId, user } = req.body;
//     try {
//         const book = await Book.findById(bookId);
//         if (!book || !book.available){
//             res.status(404).json({ message: 'Book not available' });
//         }

//         const borrowing = new Borrow({ book: bookId, user });
//         const savedBorrowing = await borrowing.save();

//         book.available = false;
//         await book.save();

//         res.status(201).json(savedBorrowing);
//     } catch (err) {
//         res.status(500)
//     }
// });

router.post('/request', BorrowController.requestToBorrow);

router.get('/requests', BorrowController.getBorrowingRequest);

module.exports = router;