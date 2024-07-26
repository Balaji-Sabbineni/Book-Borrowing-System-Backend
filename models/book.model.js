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
    owner: {
        type: String,
        // ref:'User',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
});

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;
