const Book = require('../models/book.model');
const User = require('../models/user.model');

exports.addBook = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User Authentication failed" });
        }

        let book = await Book.findOne({
            title: { $eq: req.body.title },
            author: { $eq: req.body.author },
            genre: { $eq: req.body.genre }
        }).lean();
        if (book) {
            if (!book.owners.includes(req.user._id)) {
                book.owners.push(req.user._id);
            }
        } else {
            book = new Book({
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                owners: [req.user._id],
                available: true,
                borrowedDate: null,
                returnedDate: null,
                tags: ['Owned']
            });
        }
        const savedBook = await book.save();
        const user = await User.findById(req.user._id);
        if (!user.books.includes(book._id)) {
            user.books.push(book._id);
            await user.save();
        }
        //await User.findByIdAndUpdate(req.user._id, { $addTOSet: { books: book._id } });
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
                    url: `${req.protocol}://${req.get('host')}/user/books/${book._id}`
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
        const bookId = req.body.bookId;
        const title = req.body.title;
        const author = req.body.author;
        let book;

        if (bookId) {
            book = await Book.findById({ bookId: { $eq: bookId } });
            if (!book) {
                return res.status(404).json({ message: "Book not found." });
            }
            const { __v, ...bookWithoutV } = book.toObject();
            return res.status(200).json({
                ...bookWithoutV,
                request: {
                    type: "GET",
                    url: `${req.protocol}://${req.get('host')}/user/books/${book._id}`
                }
            });
        }

        const query = {};
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (author) {
            query.author = { $regex: author, $options: 'i' };
        }
        const books = await Book.find(query);
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found." });
        }
        const booksWithUrls = books.map(book => {
            const { __v, ...booksWithoutV } = book.toObject();
            return {
                ...booksWithoutV,
                request: {
                    type: "GET",
                    url: `http://localhost:3000/user/books${book._id}`
                }
            };
        });
        res.status(201).json({ booksWithUrls });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const allowedProperties = ['title', 'author', 'genre', 'owners', 'available', 'borrowedDate', 'returnedDate', 'tags'];
        const sanitizedBody = {};
        for (const prop of allowedProperties) {
            if (req.body.hasOwnProperty(prop)) {
                sanitizedBody[prop] = req.body[prop];
            }
        }
        const updatedBook = await Book.findByIdAndUpdate({ bookId: { $eq: bookId } }, sanitizedBody, { new: true });
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Deleted Book Successfully", deletedBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
