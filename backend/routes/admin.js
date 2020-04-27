const router = require('express').Router();
const express = require('express');
const bcrypt = require('bcryptjs');

let Order = require('../models/order.model');
let User = require('../models/user.model');
let Product = require('../models/product.model');

const passport = require('passport');
const passportLogin = require('../config/passport')
const expressValidator = require('express-validator');
router.use(expressValidator());

//Admin can check all the orders that has been placed so far. Admin needs to authenticate to view the orders
router.get('/getAllOrders', passport.authenticate('local'),
    function(req, res) {
        Order.find()
            .then((foundOrder) => {
                res.send(foundOrder);
            }).catch(err => res.status(400).json('Error: No Order' + err));
    });

router.get('/totalCost', passport.authenticate('local'),
    function(req, res) {
    let totalprice = 0
    Order.find()
        .then((foundOrder) => {
            if (foundOrder) {
                console.log(foundOrder)
                for (let item of Object.keys(foundOrder)) {
                    value = foundOrder[item]
                    totalprice = totalprice + value.totalamount;
                };
                res.json("Total Price : " + totalprice)
            }});
});

router.post('/addPeople', passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        let newUser = new User({
            username: req.body.newusername,
            email: req.body.newemail,
            phone: req.body.newphone,
            password: "newuser",
            role: req.body.newrole
        });
        if (req.body.newrole == 2){
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(() => res.json('Welcome Admin ' +req.user.username +'. New Admin ' +req.body.newusername +' added successfully!'))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
            });
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(() => res.json('Welcome Admin ' +req.user.username +'. New Seller ' +req.body.newusername +' added successfully!'))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
            });
        }
    });

router.get('/getAllUsers', passport.authenticate('local'),
    function(req, res) {
    User.find()
        .then((foundUser) => {
            res.send(foundUser)
        }).catch(err => res.status(400).json('Error: No User' + err));
});

//Get all products available
router.get('/getAllProducts', (req, res) => {
    Product.find()
        .then((foundProduct) => {
            res.send(foundProduct);
        }).catch(err => res.status(400).json('Error: No Products' + err));
});

// Search product by name
router.post('/searchProduct', (req, res) => {
    let response = {};
    Product.findOne({name: req.body.name})
        .then((foundProduct) => {
            res.json("Product Found!" + foundProduct)
        }).catch(err => res.status(400).json('Error: Product not found' + err))
});

router.delete('/deletePeople', passport.authenticate('local'),
    function(req, res) {
        if(req.user._id == req.body.userid){
            res.json("Admin " + req.user.username +", You are trying to delete yourself")
        }else {
            User.findByIdAndDelete(req.body.userid)
                .then(() => res.status(200).json('Succesfully deleted!'))
                .catch((err) => res.status(400).json('Failed to delete ' + err));
        }
    })

module.exports = router;