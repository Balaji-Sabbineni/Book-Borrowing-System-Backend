const Borrowing = require('../models/borrow.model');
const Book = require('../models/book.model');
const User = require('../models/user.model');

exports.requestToBorrow = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book || !book.available) {
            return res.status(400).json({ message: 'Book not available' });
        }
        const request = new Borrowing({
            book: book._id,
            requester: req.user._id,
            owner: book.owners[0]
        });
        await request.save();
        res.status(201).json({ message: 'Borrowing request created', request})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await Borrowing.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (request.owner.toString() === req.user._id.toString()) {
            return res.status(202).json({ message: "You already own this book!" });
        }
        request.status = status;
        if (status === 'accepted') {
            const book = await Book.findById(request.book);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            book.available = false;
            book.borrower = request.requester;
            const user = await User.findByIdAndUpdate(book.borrower, { $push: { books: book._id } });
            book.tags = ['Borrowed'];
            request.borrowedDate = new Date();
            await book.save();
        } else if (status === 'rejected') {
            request.borrowedDate = null;
        }
        await request.save();
        res.status(200).json({ message: "Request Updated", request });
    } catch (err) {

    }
};

exports.getBorrowingRequest = async (req, res, next) => {
    try {
        const requests = await Borrowing.find({ owner: req.user._id }).populate('book requester');
        res.status(201).json(requests);
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
        if (request.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User not authorized" });
        }
        request.status = 'returned';
        request.returnedDate = new Date();
        
        const book = await Book.findById(request.book);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        book.available = true;
        book.borrower = null;
        book.tags = ['Owned']
        await request.save();
        await book.save();
        
        res.status(200).json({ message: "Book returned successfully", request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while returning the book" });
    }
};