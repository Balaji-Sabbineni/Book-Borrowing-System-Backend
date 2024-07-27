const mongoose = require('mongoose');

const borrowingSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    requester: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'approved', 'returned'], 
        default: 'pending'
    },
    borrowedDate: {
        type: Date
    },
    returnDate: {
        type: Date,
    }
}, { timestamps: true });

const BorrowingModel = mongoose.model('Borrowing', borrowingSchema);
module.exports = BorrowingModel;
