const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    card_num: {
        type: String,
        required: true,
        isNumeric: true,
        minlength: 16,
        maxlength: 16
    },

    card_cvv : {
        type: String,
        required:true,
        isNumeric: true,
        minlength: 3,
        maxlength: 3

    },

    card_zip : {
        type: String,
        required: true,
        isNumeric: true,
        minlength: 5,
        maxlength: 5

    },

    card_type:
        {
            type : String,
            required: true
            //enum : [0,1],
            //default: 0
        }

});

const CardModel = mongoose.model('Card', cardSchema);

module.exports = CardModel;