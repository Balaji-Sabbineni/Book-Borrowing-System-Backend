const Borrowing = require('../models/borrow.model');
const Book = require('../models/book.model');

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
            owner: book.owner
        });
        await request.save();
        res.status(201).json({ message: 'Borrowing request created' })
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

exports.getBorrowingRequest = async(req, res, next) => {
    try {
        const requests = await Borrowing.find({owner: req.user._id}).populate('book requester');
        res.status(201).json(requests);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};

// exports.updateRequestStatus = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;
//         const request = await Borrowing.findById(id);
//         if (!request || request.owner.toString !== req.user._id.toString())
//             return res.status(404).json({ message: 'Request not found or not authorized' });

//         request.status = status;
//         if (status === 'approved') {
//             const book = await Book.findById(request.book);
//             book.available = false;
//             request.borrowedDate = new Date();
//             await book.save();
//         } else if (status === 'returned') {
//             request.borrowedDate = null;
//         }
//         await request.save();
//         res.status(200).json({ message: "Request updated" })
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
