// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Purchase = require('../purchase');
const Tutor = require('../tutors');

Purchase.find((err, purchases) => {
  if (err) {
    console.log('ERROR -----');
  }
  else {
    console.log('SUCCESS ------');

    purchases.forEach((purchase, purchaseIndex)=>{
      console.log('--------');

      purchase.purchaseComplete = false;

      purchase.save((err)=>{
        if (err) {
          console.log('ERROR * * * * * * * * * * * * ');
        }
        else {
          console.log('Complete ! !');
        }
      })


    });
  }
});
