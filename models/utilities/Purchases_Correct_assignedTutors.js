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

        purchase.cart.forEach((cartItem, cartIndex)=>{


        if (!purchase.cart[cartIndex].assignedTutors) {
          // create assigned tutors array
            purchase.cart[cartIndex].assignedTutors = [];
        }

        Purchase.findById(purchase._id).exec((err, updatedPurchase) => {
          if (err) {
            console.log('ERROR -----');
          }
          else {
            // save the purchase with new tutor assignment info
            updatedPurchase.cart = purchase.cart;
            updatedPurchase.save((err) => {
              if (err) {
                console.log('ERROR purchase SAVE: ');
              }
              else {
                console.log('SAVE SUCCESSFUL');
                // console.log(purchase);
              }
            });
          }
        });
      }); // end purchases for each
    }); // end purchases for each
  }
});
