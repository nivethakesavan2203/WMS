const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
    type: String,
        unique: true,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    password: {
        type: String,
            required: true
    },
    phone: {
        type:String,
        required: true,
    },
    role :{
        type : Number,
        required: true,
        default: 0
    }

});

userSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;






