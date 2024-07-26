const Book = require('../models/book.model');

exports.addBook = async (req, res, next) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        owner: req.body.owner,
        available: req.body.available
    });
    try {
        const savedBook = await book.save();
        res.status(201).json({ Status: true, savedBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.showAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        const booksWithUrls = books.map(book => {
            const { __v, ...booksWithoutV } = book.toObject();
            return {
                ...booksWithoutV,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/user/books/${book._id}`
                }
            };
        });
        res.status(200).json({ booksWithUrls });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
        } else {
            const {__v, ...booksWithoutV } = book.toObject();
            res.status(200).json(booksWithoutV);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        res.status(200).json(deletedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
