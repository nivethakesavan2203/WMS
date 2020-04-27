const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    items: [{
        product:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
        quantity: Number
    }
    ]
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;

