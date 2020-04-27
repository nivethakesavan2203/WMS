const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const passport = require('passport');

router.post('/addProduct', passport.authenticate('local'),
    function(req, res) {

        let response = {};
        User.findById(req.user._id)
            .then((foundUser) => {
                let role = foundUser.role;
                if (role === 1) {
                    const seller_id = req.user._id;
                    const name = req.body.name;
                    const description = req.body.description;
                    const price = req.body.price;


                    const product = new Product({
                        seller_id,
                        name,
                        description,
                        price

                    });
                    product.save()
                        .then(() => {
                            response["message"] = "'Product added successfully!'";
                            response["productDetails"] = product;
                            return res.status(200).json(response)
                        })
                        .catch(err => res.status(400).json('Error, something wrong while adding the product: ' + err));
                } else {
                    res.status(200).json('Permission Denied , Please login as a seller');
                }

            }).catch(err => res.status(400).json('Error: User does not exist' + err));

    }
);

router.delete('/deleteProduct', passport.authenticate('local'),
    function(req, res) {
    User.findById(req.user._id)
        .then((foundUser) => {
                Product.findByIdAndDelete(req.body._id)
                    .then(() => res.status(200).json('Hi Seller ' + req.user.username+'!. Succesfully deleted product from listing'))
                    .catch((err) => res.status(400).json('Failed to delete product ' + err));
            }
        );
});

module.exports = router;