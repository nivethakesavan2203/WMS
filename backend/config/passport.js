const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport')
require('../models/user.model');
//var User= require('mongoose').model('User');

module.exports = function(passport) {
    // Local Strategy
    passport.use('local', new LocalStrategy(function(username, password, done){
        //console.log('*** in passport.use')
        // Match Username
        //console.log(username);
        //console.log(password);
        let query = {username: username};
        User.findOne(query, function (err, user) {
            //console.log(user)
            if (err) {
                //console.log('*** err', err)
                return done(err);
            }
            if (!user) {
                //console.log('*** no username')
                return done(null, false, {message: 'No user found'});
            }
            //console.log(password)
            //console.log(user.password)
            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    //console.log('Password match')
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
        consumerKey: "wcXUEMZ0WAP7vLBQRZnO7mbeT",
        consumerSecret: "38QzHsp98yYGWG6gsJLng2A9ioVgML3f2KhsYpuHqMtDLKOi1H",
        callbackURL: "http://localhost:3000/user/home",
        profileFields: ['emails', 'displayName']
    },
    function(token, tokenSecret, profile, done) {
        User.findOrCreate({ twitterEmail: profile.email }, function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: "1cf8a35b450ffef8ac69affda1b1dff1",
        clientSecret: "a36482dacae53d86edaccbc929d63ca3",
        callbackURL: "http://localhost:3000/user/home",
        profileFields: ['emails', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ facebookEmail: profile.email }, function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));


var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

passport.use(new GoogleStrategy({
        consumerKey: "1021399281606-ag9fvm8drd6q9c2r4cr8v58vlbjbjiio.apps.googleusercontent.com",
        consumerSecret: "9HGlztSGeQwZEfQPAU4UACLW",
        callbackURL: "http://localhost:3000/user/home",
        profileFields: ['emails', 'displayName']
    },
    function(token, tokenSecret, profile, done) {
        User.findOrCreate({ googleEmail: profile.email }, function (err, user) {
            return done(err, user);
        });
    }
))