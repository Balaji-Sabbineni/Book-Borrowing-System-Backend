const Borrowing = require('../models/borrow.model');
const Book = require('../models/book.model');
const User = require('../models/user.model');

exports.requestToBorrow = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById({ _id: { $eq: bookId } });
        if (!book || !book.available) {
            return res.status(400).json({ message: 'Book not available' });
        }

        if (req.user._id.toString() === book.owners[0]) {
            return res.status(400).json({ message: 'Cannot borrow your own book' });
        }
        const request = new Borrowing({
            book: book._id,
            requester: req.user._id,
            owner: book.owners[0]
        });
        await request.save();
        res.status(201).json({ message: 'Borrowing request created', request })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await Borrowing.findById({ _id: { $eq: id } });
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (request.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this request" });
        }
        if (request.status !== 'pending') {
            return res.status(400).json({ message: "cannot update a non-pending request" });
        }
        request.status = status;
        if (status === 'accepted') {
            const book = await Book.findById(request.book);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            if (!book.available) {
                return res.status(400).json({ message: "Book is no longer available" });
            }
            book.available = false;
            book.borrower = request.requester;
            const user = await User.findById(book.borrower);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.books.push({ book: book._id, status: 'borrowed' });
            book.tags = ['Borrowed'];
            request.borrowedDate = new Date();
            await user.save();
            await book.save();
        } else if (status === 'rejected') {
            request.borrowedDate = null;
        } else {
            return res.status(400).json({ message: "Invalid status" });
        }
        await request.save();
        res.status(200).json({ message: "Request Updated", request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBorrowingRequest = async (req, res, next) => {
    try {
        const requests = await Borrowing.find({ owner: req.user._id }).populate('book requester');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.returnBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = await Borrowing.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to return this book" });
        }
        if (request.status !== 'accepted') {
            return res.status(400).json({ message: "cannot return a book that hasn't been borrowed" });
        }
        request.status = 'returned';
        request.returnedDate = new Date();

        const book = await Book.findById(request.book);
        if (!book) {
            return res.status(404).json({ message: "Error: 404, Book not found!" });
        }
        book.available = true;
        book.borrower = null;
        book.tags = ['Owned'];
        await User.findByIdAndUpdate(req.user._id, { $pull: { books: { book: book._id } } });
        await User.findByIdAndUpdate(book.owner, { $push: { books: { book: book._id, status: 'owned' } } });

        await request.save();
        await book.save();

        res.status(200).json({ message: "Book returned successfully", request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
