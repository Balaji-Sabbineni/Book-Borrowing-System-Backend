const Book = require('../models/book.model');
const User = require('../models/user.model');

exports.addBook = async (req, res, next) => {
    if (!req.user) {
        return res.status(404).json({ message: "User Authentication failed" });
    }
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        owner: req.user._id,
        available: req.body.available
    });
    try {
        const savedBook = await book.save();
        await User.findByIdAndUpdate(req.user._id, { $push: { books: savedBook._id } });
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

exports.findBook = async (req,res, next) => {
    try {
        const {bookId, title, author} = req.body;
        let book;

        if (bookId) {
            book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found." });
            }
            const { __v, ...bookWithoutV } = book.toObject();
            return res.status(200).json({
                ...bookWithoutV,
                request: {
                    type: "GET",
                    url: `http://localhost:3000/user/books/${book._id}`
                }
            });
        }

        const query = {};
        if(title){
            query.title = {$regex: title, $options: 'i'};
        }
        if(author){
            query.author = {$regex: author, $options: 'i'};
        }
        const books = await Book.find(query);
        if(books.length === 0){
            return res.status(404).json({message: "No books found."});
        }
        const booksWithUrls = books.map(book =>{
            const { __v, ...booksWithoutV} = book.toObject();
            return {
                ...booksWithoutV,
                request:{
                    type: "GET",
                    url: `http://localhost:3000/user/books${book._id}`
                }
            };
        });
        res.status(201).json({booksWithUrls});
    } catch (err) {
        res.status(500).json({message: err.message});
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
