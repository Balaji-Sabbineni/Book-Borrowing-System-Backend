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
    genre:{
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    available: {
        type: Boolean,
        default: true
    },
    borrowedDate: {
        type: Date
    },
    returnedDate: {
        type: Date
    }
});

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;
