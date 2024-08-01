const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firebaseUid: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Firstname: {
        type: String
    },
    Lastname: {
        type: String
    },
    phonenumber: {
        type: Number
    },
    books: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            },
            status: {
                type: String,
                default:'owned'
            }
        }
    ]
});

// userSchema.pre('save', function(next){
//     if(!this.isModified('password')) return next();
//     bcrypt.hash(this.password, 9, (err, hash) =>{
//         if(err) return next(err);
//         this.password = hash;
//         next();
//     });
// });

const User = mongoose.model('User', userSchema);
module.exports = User;
