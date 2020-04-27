const router = require('express').Router();
const express = require('express');
let Card = require('../models/card.model');
const passport = require('passport');


const app = express();
const expressValidator = require('express-validator');
router.use(expressValidator());

router.post('/pay', passport.authenticate('local'),
    function(req, res) {
    const userid = req.user._id;
    const cardNum = req.body.card_num;
    const cardCvv = req.body.card_cvv;
    const cardZip = req.body.card_zip;
    const cardType = req.body.card_type;

    req.checkBody('cardNum', 'Card number is required').notEmpty();
    req.checkBody('cardCvv', 'CVV is required').notEmpty();
    req.checkBody('cardZip', 'Zip code is required').notEmpty();
    req.checkBody('cardType', 'Card type is required').notEmpty();


    let newCard = new Card({
             card_num: cardNum,
             card_cvv: cardCvv,
             card_zip: cardZip,
             card_type :cardType,
             userid

        });
    if(cardType == "Debit" || cardType == "debit"){
        newCard.save()
            .then(() => res.json(cardType + ' Payment Successful!'))
            .catch(err => res.status(400).json('Error: ' + err));
    }else if(cardType == "credit" || cardType == "Credit") {
        newCard.save()
            .then(() => res.json('Credit Payment Successful!'))
            .catch(err => res.status(400).json('Error: ' + err));
    }else{
        res.json('We support only credit and debit payments.')
    }
 });


module.exports = router;


