const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

router.post('/', async (req, res, next) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        available: req.body.available,
        borrowedDate: req.body.borrowedDate,
        returnedDate: req.body.returnedDate
    });
    try {
        const savedBook = await book.save();
        res.status(201).json({ Status: true, savedBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
        } else {
            res.status(200).json(book);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        res.status(200).json(deletedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
