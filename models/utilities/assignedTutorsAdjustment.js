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

        // create assigned tutors array
        purchase.cart[cartIndex].assignedTutors = [];

        // if a tutor was selected
        if (cartItem.tutorID) {

          console.log('ID: ' + cartItem.tutorID);

          // query
          Tutor.findById(cartItem.tutorID).select({"photo":0}).exec((err, tutor) => {
            if (err) {
              console.log('ERROR -----');
            }
            else {
              if (tutor) {
                console.log('SUCCESS ------');
                // console.log(tutor);
                var tutorInfo = {
                  tutorID: tutor._id,
                  firstName: tutor.firstName,
                  lastName: tutor.lastName,
                  nickname: tutor.nickname,
                  contact: tutor.contact
                };
                // add to array
                purchase.cart[cartIndex].assignedTutors.push(tutorInfo);

                console.log(tutorInfo.contact);
              }
              else {
                console.log('No Tutor by ID');
              }

              console.log('NEW CART');
              console.log('* * * * * * * * * * ');
              console.log(purchase.cart[cartIndex].assignedTutors);
              console.log('* * * * * * * * * * ');



            }
          }); // end tutor findById


        }


      }); // end cart for each

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
  }
});
