const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    borrowDate: {
        type: Date
    },
    returnDate: {
        type: Date
    }
});

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;
