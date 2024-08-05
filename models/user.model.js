const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    books:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
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

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;