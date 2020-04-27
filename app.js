const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

const users = require('./route/users')
const admin = require('./route/admin')
const seller = require('./route/seller')
const searchProduct = require('./route/SearchProduct')

app.use('/users', users)
/*app.use('/users', admin)
app.use('/users', seller)
app.use('/users', searchProduct)*/


// Passport Middleware
require('../config/passport') /*(passport)*/;
app.use(passport.initialize());
app.use(passport.session());


