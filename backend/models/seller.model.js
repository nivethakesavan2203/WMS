const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const sellerSchema = new Schema({

    seller_id: {
        type: Number,
        required: true,
        unique: true
    },

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
    }

});

sellerSchema.plugin(passportLocalMongoose);

const SellerModel = mongoose.model('Seller', sellerSchema);

module.exports = SellerModel;