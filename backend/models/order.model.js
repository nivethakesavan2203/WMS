const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalamount : {
        type:Number
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

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;

