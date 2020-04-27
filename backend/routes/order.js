const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const passport = require('passport');

router.post('/placeOrder', passport.authenticate('local'),
    function(req, res) {
    const userid = req.user._id;
    let totalprice = 0;
    let response = {};

    Cart.findOne({userid: userid})
        .then((foundCart) => {
            if (foundCart) {
                let len = foundCart.items.length;
                let currentLen = 0;
                for (let item of foundCart.items) {

                    Product.findById(item.product)
                        .then((foundProduct) => {
                            currentLen++;
                            let price = foundProduct.price;
                            totalprice = totalprice + (price * item.quantity);
                            if (len === currentLen) {
                                //Order table entry
                                let myOrder = {
                                    userid: userid,
                                    totalamount: totalprice,
                                    items: foundCart.items
                                };


                                //Payment



                                //Create an order doc in Order table
                                Order.create(myOrder).then(() => {
                                    Cart.findByIdAndDelete(foundCart._id).then(() => {
                                        response["message"] = "Order Successfully Placed";
                                        response["orderDetails"] = myOrder;
                                        return res.status(200).json(response)
                                    }).catch(err => res.status(400).json('Cart could not be cleared' + err))
                                })
                            }
                        }).catch(err => res.status(400).json('Product not found' + err))

                }
            } else {
                //Cart doesn't exist
                res.status(200).json('Cart is empty , Please add to cart before placing Order!!');
            }
        }).catch(err => res.status(400).json('Error: User does not exist' + err));
});


router.delete('/cancelOrder', passport.authenticate('local'),
    function(req, res) {
        Order.findByIdAndDelete(req.body.orderid)
                .then(() => res.status(200).json('Succesfully cancel the order!'))
                .catch((err) => res.status(400).json('Failed to cancel ' + err));
        })


module.exports = router;