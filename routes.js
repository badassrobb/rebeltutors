var express = require('express');
var router = express.Router();
var path = require('path');
const moment = require('moment');

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Purchase = require('./models/purchase');
const Tutor = require('./models/tutors');
// Mailbot
const Mailbot = require('./models/mailbot.js')();

var colors = require('colors');

// SLACK
var Slack = require('slack-node');
var slack_apikey = "https://hooks.slack.com/services/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";
var slack = new Slack();
slack.setWebhook(slack_apikey);





module.exports = function (serverEnvironment, Raven) {


  console.log('ENV');
  console.log(serverEnvironment);

  if (serverEnvironment == "production"){
    // PRODUCTION
    slack.webhook({
          channel: "#server-notices",
          username: "BADASS TUTORS BOT",
          text: ("Server Starting Up! - - " + serverEnvironment)
        }, function(err, response) {
          // console.log(response);
        });
  }





  // # # # # # # # # # # # # #
  // # # # # # # # # # # # # #
  // Start SQUARE #########
  // # # # # # # # # # # # # #
  var SquareConnect = require('square-connect');
  var defaultClient = SquareConnect.ApiClient.instance;
  var oauth2 = defaultClient.authentications['oauth2'];

  // ENVIRONMENT VARIABLES
  // * * * * * * * * * *
  // Production
  if (serverEnvironment == "production"){
    // PRODUCTION
    console.log(' # # # # # # # # # # # # # '.red);
    console.log('- - - - PRODUCTION SQUARE - - - - '.green);
    console.log(' # # # # # # # # # # # # # '.red);
    oauth2.accessToken = "sq0atp-lVl-AkY7Rp1bfo4EKDG32w";
    var LOCATION_ID = '1Y60P7A574X4W';
  }
  // * * * * * * * * * *
  // Sandbox
  else {

    // Sandbox Environment
    console.log(' # # # # # # # # # # # # # '.red);
    console.log('- - - - SANDBOX SQUARE - - - - '.green);
    console.log(' # # # # # # # # # # # # # '.red);
    oauth2.accessToken = "sandbox-sq0atb-uG05sLO0iQRfdT7_YKDWQA";
    var LOCATION_ID = 'CBASEKfXJigvKs3b5PRHBFfGJ1cgAQ';

  }

  var sq_api = new SquareConnect.LocationsApi();
  var transactionsAPI = new SquareConnect.TransactionsApi();
  // # # # # # # # # # # # # #
  // # # # # # # # # # # # # #
  // # # # # # # # # # # # # #
  // End SQUARE
  // # # # # # # # # # # # # #



  /* GET Google youtube verification page page. */
  // This is temporary to validate Robbs youtube account, remove once approved

  router.get('/google08c3cefee816fd66.html', function(req, res, next) {
    console.log('request');
    res.sendFile(path.join(__dirname, '/views/google08c3cefee816fd66.html'));
  });





  /* GET home page. */
  router.get('/', function(req, res, next) {
    console.log('request');
    res.sendFile(path.join(__dirname, '/views/index.html'));
  });

  /* GET 404 page. */
  router.get('/404', function(req, res, next) {
    console.log('request');
    res.sendFile(path.join(__dirname, '/views/404.html'));
  });



  /* GET Tutors page. */
  router.get('/tutors', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/tutors.html'));
  });

  /* GET Buy Hours page. */
  router.get('/buy', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/buy.html'));
  });

  /* GET Reviews page. */
  router.get('/reviews', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/reviews.html'));
  });

  /* GET Book page. */
  router.get('/book', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/book.html'));
  });

  /* GET Apply page. */
  router.get('/apply', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/apply.html'));
  });

  /* GET Contact page. */
  router.get('/contact', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/contact.html'));
  });

  /* GET Guaranteed page. */
  router.get('/guarantee', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/guarantee.html'));
  });

  /* GET Cal Poly page. */
  router.get('/calpoly', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/calpoly.html'));
  });

  /* GET Terms of Service page. */
  router.get('/tos', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/tos.html'));
  });
  /* GET Terms of Service page. */
  router.get('/terms-of-use', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/tos.html'));
  });
  /* GET privacy-policy page. */
  router.get('/privacy-policy', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/legal/privacyPolicy.html'));
  });
  /* GET Terms of Service page. */
  router.get('/refund-policy', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/legal/refundPolicy.html'));
  });


  router.get('/checkout', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/checkout.html'));
  });

  router.get('/checkout2', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/checkout2.html'));
  });

  /* GET thankyou page. */
  router.get('/thankyou', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/thankyou.html'));
  });

  /* GET apply thankyou page. */
  router.get('/applythankyou', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/apply_thankyou.html'));
  });

  // - - - - - - - - - - - -
  // Fluffy Bunny Tutors
  // - - - - - - - - - - - -
  router.get('/fluffybunny', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/fluffybunny.html'));
  });







  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // Test payment  * * * * * *
  // - - - - - - - - - - - -
  router.post("/checkout/testMe", function (req, res) {
    console.log('Checkout TestME begin');
    // console.log('Nonce');
    // console.log(req.body.sqnonce);
    // console.log();

    console.log('- - - - - - - - - - - - - - -');
    console.log('Cart');
    console.log(req.body.cart[0].onlineTutorSession);
    console.log(req.body.cart[1].onlineTutorSession);
    console.log('- - - - - - - - - - - - - - -');
    console.log(typeof req.body.cart[1].onlineTutorSession);
    console.log('- - - - - - - - - - - - - - -');
    res.json({status:"success"})

  });






  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // Start SQUARE #########
  // - - - - - - - - - - - -
  router.post("/checkout/square", function (req, res) {
    console.log('Checkout with SQUARE begin');
    // console.log('Nonce');
    // console.log(req.body.sqnonce);
    // console.log();
    console.log('BODY- - - - - - - - - - - - - - - - - - - - -');
    console.log(req.body.body);
    console.log('- - - - - - - - - - - - - - -');

    //Record Purchase Attempt
    slack.webhook({
          channel: "#server-notices",
          username: "BADASS TUTORS BOT",
          text: ("Purchase Attempt! - - " )
        }, function(err, response) {
          // console.log(response);
        });


    const idempotencyKey = require('crypto').randomBytes(32).toString('hex');


    var squareTotalCharge = (req.body.body.total*100);
    // var squareTotalCharge = 100;
    // console.log('CHARGE AMOUNT * * * *  * * *');
    // console.log(squareTotalCharge);
    // console.log(typeof squareTotalCharge);


    const body = {
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: squareTotalCharge, currency: 'USD'
      },
      buyer_email_address: req.body.billing_address.email,
      card_nonce: req.body.sqnonce,
      billing_address: {
        address_line_1: req.body.billing_address.address_line_1,
        address_line_2: req.body.billing_address.address_line_2,
        administrative_district_level_1: req.body.billing_address.administrative_district_level_1,
        locality: req.body.billing_address.locality,
        postal_code: req.body.cardInfo.billing_postal_code,
        country: 'US'
      }//,
      // note: 'optional note'
    };



    // # # # # # # # # # # # # #
    // SQUARE
    // # # # # # # # # # # # # #
    // Production
    // Sandbox
    var LOCATION_ID = null;

    if (serverEnvironment == "production"){
      // Sandbox Environment
      LOCATION_ID = '1Y60P7A574X4W';
    }
    // Sandbox
    else {
      // Sandbox Environment
      LOCATION_ID = 'CBASEKfXJigvKs3b5PRHBFfGJ1cgAQ';
    }

    console.log('LOCATION ____ ');
    console.log(LOCATION_ID);



    transactionsAPI.charge(LOCATION_ID, body).then(function(data) {
        console.log('API called successfully. Returned data: ');
        // console.log(data);
        // Save the response to a new Purchase and save it



        // - - - - - - - - - - - - -
        // Start save response

        // Final Stage of Purchase, save and email out to customers.
        var savePurchase = ()=>{
          // * * * * * * * * * *
          // Save purchase to database
          Purchase.create(newPurchase, (err, purchase) => {
            if (err) {
              res.send('error')
            }
            else {
              // Send email to customer
              // - - - - - - - - - - - -
              if (newPurchase.formData.email != "") {
                // check server enviornment
                if (serverEnvironment == "local_sandbox") {
                  // send to customer
                  Mailbot.emailCustomerPurchase(newPurchase.formData.email, newPurchase);
                  // send copy to headquarters
                  // Mailbot.emailAdminPurchase("jwoodjack@gmail.com", newPurchase);
                }
                else if (serverEnvironment == "aws_sandbox") {
                  // send to customer
                  Mailbot.emailCustomerPurchase(newPurchase.formData.email, newPurchase);
                  // send copy to headquarters
                  // Mailbot.emailAdminPurchase("jwoodjack@gmail.com", newPurchase);
                }
                else if (serverEnvironment == "production") {
                  // send to customer
                  Mailbot.emailCustomerPurchase(newPurchase.formData.email, newPurchase);
                  // send copy to real headquarters
                  Mailbot.emailAdminPurchase("badasstutors2015@gmail.com", newPurchase);
                }
              }
              res.json({message:"success"});
            }
          });
        }




        // Create newPurchase Database Item
        var newPurchase = {
          total: req.body.body.total,
          cart: req.body.body.cart,
          date: Date.now(),
          purchaseComplete: false,
          purchaseDate: moment().format('MMMM Do YYYY, h:mm a'),
          formData: {
            firstName: req.body.body.formData.studentFirstName,
            lastName: req.body.body.formData.studentLastName,
            school: req.body.body.formData.school,
            address: req.body.body.formData.studentAddress,
            email: req.body.body.formData.studentEmail,
            phone: req.body.body.formData.studentPhone,
            goals: req.body.body.formData.studentGoals
          },
          square: data
        };

        // console.log(newPurhcase);

        // * * * * * * * * * *
        // loop through cart and add in detailed text
        newPurchase.cart.forEach((item, index)=>{
          console.log('-- CART ITEM __');
          // console.log(item);
          if (item.hourBundle == "1") {
            newPurchase.cart[index].hours = 1;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate;

          } else if (item.hourBundle == "2") {
            newPurchase.cart[index].hours = 4;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate - 5;

          } else if (item.hourBundle == "3") {
            newPurchase.cart[index].hours = 8;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate - 10;


          } else if (item.hourBundle == "4") {
            newPurchase.cart[index].hours = 16;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate - 15;


          } else if (item.hourBundle == "5") {
            newPurchase.cart[index].hours = 24;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate - 20;

          } else if (item.hourBundle == "6") {
            newPurchase.cart[index].hours = 16;
            newPurchase.cart[index].guaranteed = true;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate - 5;

          } else if (item.hourBundle == "7") {
            newPurchase.cart[index].hours = 24;
            newPurchase.cart[index].guaranteed = true;
            newPurchase.cart[index].hourlyRate = newPurchase.cart[index].rate - 5;
          }

          if (item.book) {
            newPurchase.cart[index].hours = "";
            newPurchase.cart[index].guaranteed = true;
            newPurchase.cart[index].hourlyRate = "";
            newPurchase.cart[index].price = item.price;
          }
          else {
            // set new fropice for item
            newPurchase.cart[index].price = newPurchase.cart[index].hours * newPurchase.cart[index].hourlyRate;
          }

          // set onlineTutorSession
          // * * * * * * *
          newPurchase.cart[index].onlineTutorSession = item.onlineTutorSession

          console.log('TUTOR ID FOR PURCHASE');
          console.log(item.tutorID);

          // * * * * * *
          // Save assignedTutors as an empty array for this cart item.
          // If there is a tutorID, then add it.
          newPurchase.cart[index].assignedTutors = [];
          // Check for tutorID
          if (item.tutorID) {
            // Get the tutor info
            Tutor.findById(item.tutorID).select({"photo":0}).exec((err, tutor) => {
              if (err) {
                console.log('Tutor Find by ID Error');
              }
              else {
                console.log('Tutor Found');
                // console.log(tutor);
                newPurchase.cart[index].tutorInfo = {
                  name: tutor.name,
                  contact: tutor.contact
                }
                // * * * * * * * * * * * * * * *
                // Add in new assignedTutors array
                var tutorInfo = {
                  tutorID: tutor._id,
                  firstName: tutor.firstName,
                  lastName: tutor.lastName,
                  nickname: tutor.nickname,
                  contact: tutor.contact,
                  assignedHours: newPurchase.cart[index].hours
                };
                newPurchase.cart[index].assignedTutors.push(tutorInfo);
                // * * * * * * * * * * * * * * *
                // * * * * * * * * * * * * * * *
                savePurchase();
              }
            });
          }
          else{
            newPurchase.cart[index].tutorInfo = {
              name: "",
              contact: {
                phone:"",
                email:""
              }
            };
            savePurchase();
          }
        });
        // * * * * * * * * * *
        // End Loop through cart item updates


        // - - - - - - - - - - - - - -
        // End Save resonse




      }, function(error) {
        // console.error(error);
        console.log('ERROR * * TRANSACTION API * * * * * * *');

        // console.log(error.response);
        // console.log( Object.keys(error.response.res.text) );

        var squareErrors = error.response.res.text;
        var jsonSquareErrors = JSON.parse(squareErrors);

        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // // console.log(squareErrors);
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        //
        //
        //
        // // console.log(typeof jsonSquareErrors);
        //
        //
        //
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // console.log( jsonSquareErrors );
        //
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        //
        //
        //
        // console.log( jsonSquareErrors.errors[0].detail );
        //
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');
        // console.log('* * * * * * * * * * * *');

        //Record Purchase Attempt
        slack.webhook({
              channel: "#server-notices",
              username: "BADASS TUTORS BOT",
              text: ("Purchase ERROR! - - " + JSON.stringify(jsonSquareErrors))
            }, function(err, response) {
              // console.log(response);
            });

        Raven.captureException(jsonSquareErrors);
        res.json({message:jsonSquareErrors.errors[0].detail, code:jsonSquareErrors.errors[0].code});

      });

  });
  // - - - - - - - - - - - -
  // End SQUARE #########
  // - - - - - - - - - - - -









  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // Paypal payments
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  // - - - - - - - - - - - -
  router.post("/checkout/paypal", function (req, res) {
    console.log('Checkout with braintree begin');



  });
  // - - - - - - - - - - - -
  // End Paypal
  // - - - - - - - - - - - -



    return router;
};



// module.exports = router(serverEnvironment);
