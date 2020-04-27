const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({

    seller_id: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

});

const ProductModel = mongoose.model('Product', productSchema);

module.exports =  ProductModel;