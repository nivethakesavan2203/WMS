const express = require('express');
const usersRouter = require('./routes/users');
const sellerRouter = require('./routes/seller');
const CartRouter = require('./routes/cart');
const OrderRouter = require('./routes/order');
const AdminRouter = require('./routes/admin');

const PayRouter = require('./routes/payment');

const passport = require('passport');
require('./config/passport')(passport);

var bodyParser = require('body-parser');

const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

require('dotenv').config();
const uri = process.env.ATLAS_URI;
const app = express();

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

var session = require('express-session');
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash())

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/seller', sellerRouter);
app.use('/cart', CartRouter);
app.use('/order', OrderRouter);
app.use('/admin', AdminRouter)
app.use('/payment', PayRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});



