const router = require('express').Router();
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user.model');
let Product = require('../models/product.model');


const app = express();

const expressValidator = require('express-validator');
//app.use(expressValidator());
router.use(expressValidator());
const passportLogin = require('../config/passport')


// Only an admin can get details of all users  -->This function doesn't require admin to login (which should be there)
// Added this same function to Admin where admin logins in.
/*
router.route('/getAllUsers').post((req, res) => {
    User.find({username: req.body.username})
        .then((foundUser) => {
            let role = foundUser[0].role;
            console.log(foundUser);
            if (role === 2) {
                User.find()
                    .then(users => res.json(users))
                    .catch(err => res.status(400).json('Error, something wrong while fetching users: ' + err));
            } else {
                res.status(200).json('Permission Denied , Please login as an admin');
            }

        }).catch(err => res.status(400).json('Error: Users do not exist' + err));

});
*/

// Functionality not needed
// router.route('/add').post((req, res) => {
//     const username = req.body.username;
//
//     const newUser = new User({username});
//
//     newUser.save()
//         .then(() => res.json('User added!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const role = req.body.role || 0;


    req.checkBody('username', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('phone', 'Phone number is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.json({error: errors})
    } else {
        let newUser = new User({
            username: username,
            email: email,
            phone: phone,
            password: password,
            role: role
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.json('Successfully registered');
                        //res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

// // Login Form
// router.get('/login', function(req, res){
//     res.render('login');
// });

// Login Process
router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        if (req.user.role == 0){
            console.log('Welcome user', req.user.username);
            res.json("Welcome User " + req.user.username);
        }
        else if (req.user.role == 1) {
            res.json("Welcome Seller " + req.user.username);
        } else {
            res.json("Welcome Admin " + req.user.username)
        }

    });

//facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

//google authentication
app.get('/auth/google', passport.authenticate('google', {scope: 'https://www.google.com/m8/feeds'}));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

//twitter authentication
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

//Finding user by name and update email and phone
router.post('/updateUser', passport.authenticate('local'),
    function(req, res) {
    User.findOne({username: req.user.username})
        .then((foundUser) => {
            foundUser.email = req.body.email;
            foundUser.phone = req.body.phone;
            foundUser.save()
                .then(() => {res.json('Welcome ' + foundUser.username +'. Email and Phone number is changed successfully' + foundUser)})
                .catch(err => res.status(400).json('User could not be updated' + err));
        })
        .catch(err => res.status(400).json('Error: User does not exist' + err));
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
            response["message"] = "Product found.";
            response["productDetails"] = foundProduct;
            return res.status(200).json(response)
            res.send(foundProduct);
        });
});

router.post('/updatePassword', passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        User.findOne({username: req.body.username})
        .then((foundUser) => {
            foundUser.password = req.body.newpassword
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(foundUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    foundUser.password = hash;
                    foundUser.save()
                        .then(() => res.json('Welcome ' + foundUser.username +'. Your Password is changed successfully' + foundUser))
                        .catch(err => res.status(400).json('Error: ' + err));
                })});
        })
        .catch(err => res.status(400).json('Cannot update : ' + err));
});


module.exports = router;


