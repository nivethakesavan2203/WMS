const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const passport = require('passport');

// Reference: addtocart logic https://github.com/ivan3123708/fullstack-shopping-cart
// Add to Cart functionality and Update
router.post('/addToCart', passport.authenticate('local'),
    function(req, res) {

    const userid = req.user._id;

    const item = {
        product: req.body.product,
        quantity: req.body.quantity
    };
    //Check for an existing cart for the user
    Cart.findOne({ userid: userid })
        .then((foundCart) => {
            if (foundCart) {
                //Cart exists for the user .. Appending Products and Quantity to the existing cart
                let products = foundCart.items.map((item) => item.product + '');
                if (products.includes(item.product)) {
                    Cart.findOneAndUpdate({
                            userid: userid,
                            items: {
                                $elemMatch: { product: item.product }
                            }
                        },
                        {
                            $inc: { 'items.$.quantity': item.quantity }
                        })
                        .exec()
                        .then(() => res.status(200).json('Cart with items found: Successfully Added Product to the cart!!'));
                } else {
                    // Empty cart exists for user.. Adding the products to this cart

                    foundCart.items.push(item);
                    foundCart.save().then(() => res.status(200).json('Successfully Added Product to the cart!!'));
                    ;
                }
            } else {

                //Cart doesn't exist, Creating new cart and adding the items

                Cart.create({
                    userid: userid,
                    items: [item]
                })
                    .then(() => res.status(200).json('Created a new cart and Successfully Added Product to the cart!!'));
            }
        });
});


//View cart items
router.post('/viewCart', passport.authenticate('local'),
    function(req, res) {
    let  userid = req.user._id;
        Cart.find({ userid: req.user._id})
        .then((foundCart) => {
            console.log(foundCart);
            res.status(200).json(foundCart);
        }).catch(err => res.status(400).json('Failed to fetch cart' + err));

});

//Delete the cart
router.delete('/deleteCart', passport.authenticate('local'),
    function(req, res) {
    Cart.findByIdAndDelete(req.body.cartid)
        .then(() =>  res.status(200).json('Succesfully deleted cart'))
        .catch((err) => res.status(400).json('Failed to delete cart' + err));
});

module.exports = router;

