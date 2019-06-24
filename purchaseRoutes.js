// apiRoutes.js

// Setup
var express = require('express');
var router = express.Router();
var path = require('path');
const striptags = require('striptags');
// Mailbot
const Mailbot = require('./models/mailbot.js')();
// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Tutor = require('./models/tutors');
const SearchStats = require('./models/searchStats');
const Purchase = require('./models/purchase');


// - - - - - - - - -
// - - - - - - - - -
// MODULE
// - - - - - - - - -
module.exports = function (serverEnvironment) {


  // - - - - - - - - - - - - - - - - -
  /* remove Purchase */
  // - - - - - - - - - - - - - - - - -
  router.route('/remove/:purchase_id').post( function(req, res) {
    console.log('PURCHASE ROUTE');

    Purchase.findById(req.params.purchase_id, (err, purchase) => {
      if (err) {
        res.send('err')
      }

      //update tutor info
      purchase.deleted = true;


      purchase.save((err) => {
        if (err) {
          console.log('ERROR Purchase Removal SAVE: ');
          console.log(err);
          res.send('err')
        }
        else {
          res.json('success');

          console.log('Purchase Updated');
        }
      });
    });
  });



  return router;
};
