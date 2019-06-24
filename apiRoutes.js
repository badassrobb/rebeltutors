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
// Secure random generator
const uuidv4 = require('uuid/v4');



// Title Case Function
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// check duplicates
function validEmail(email, tutorID, callback) {

  Tutor.find((err, tutors) => {
    if (err) {
      res.send('err')
    }
    else {
      var emailIsValid = true;

      // loop through tutors and check for matching email
      tutors.forEach((tutor, tutorIndex)=>{
        if (email == tutor.local.email) {
          console.log('DUPLICATE EMAIL FOUND');
          console.log('');
          console.log(email);
          console.log(tutor.local.email);
          if (!tutor._id.equals(tutorID)) {
            console.log(tutorID);
            console.log(tutor._id);
            console.log( tutor._id.equals(tutorID) );
            emailIsValid = false;
          }

          console.log('');
        }
      });
      callback(emailIsValid);
    }
  });
}

// - - - - - - - - -
// - - - - - - - - -
// MODULE
// - - - - - - - - -
module.exports = function (serverEnvironment) {
  /* GET Purchases */
  router.route('/purchases').get( function(req, res) {
    Purchase.find({deleted:{$ne:true}}).sort({date:-1}).exec((err, tutors) => {
      if (err) {
        res.send('err')
      }
      else {
        console.log('Found Purchases');
        res.json(tutors);
      }
    });
  });

  /* GET Admin Purchases With Assignments */
  router.route('/purchases/admin').get( function(req, res) {
    Purchase.find({deleted:{$ne:true}}).sort({date:-1}).exec((err, purchases) => {
    // Purchase.find().sort().exec((err, purchases) => {
      if (err) {
        res.send('err')
      }
      else {
        console.log('Found Purchases');
        console.log(purchases.length);
        // console.log(purchases);
        // go through each one and map the state of unassignedTutors

        purchases.forEach((purchase, purchaseIndex)=>{
          // log hours calculations
          var tutorLoggedHours = 0;
          var loggedHoursTotal = 0;
          // set default to false
          purchases[purchaseIndex].assignMe = false;
          // search for any null tutorID in cart
          purchases[purchaseIndex].cart.forEach((cartItem, cartIndex)=>{
            // check for logged hours and calculate
            if (cartItem.loggedHours) {
                cartItem.loggedHours.forEach((log, logIndex)=>{
                  // log all hours
                  loggedHoursTotal += log.hours;
                });
            }
            // set cart item logged hours
            purchases[purchaseIndex].cart[cartIndex].loggedHoursLeft = (purchases[purchaseIndex].cart[cartIndex].hours - loggedHoursTotal);
            purchases[purchaseIndex].cart[cartIndex].loggedHoursTotal = loggedHoursTotal;
            //
            // If no assignedTutors object, make it
            if (!cartItem.assignedTutors) {
              purchases[purchaseIndex].assignMe = true;
              purchases[purchaseIndex].cart[cartIndex].assignedTutors = [];
            }
            else if (cartItem.assignedTutors.length == 0) {
              purchases[purchaseIndex].assignMe = true;
            }
          });
        });
        console.log('Returning Results');
        res.json(purchases);
      }
    });
  });

  /* GET Tutors */
  // ------------------------
  // ------------------------
  router.route('/tutors').get( function(req, res) {
    Tutor.find((err, tutors) => {
      if (err) {
        res.send('err')
      }
      else {
        res.json(tutors);
      }
    });
  });

  /* GET Tutors No Photos */
  // ------------------------
  // ------------------------
  router.route('/tutors/nophotos').get( function(req, res) {
    Tutor.find({}).select({"photo":0, "local.password":0}).exec((err, tutors) => {
      if (err) {
        res.send('err')
      }
      else {
        res.json(tutors);
      }
    });
  });

  /* GET Tutors ListNo Photos */
  // ------------------------
  // ------------------------
  router.route('/tutors/list').get( function(req, res) {
    Tutor.find({}).select({"firstName":1, "_id":1, "lastName":1, "nickname":1, "contact":1}).sort({"firstName":1}).exec((err, tutors) => {
      if (err) {
        res.send('err')
        console.log(err);
      }
      else {
        res.json(tutors);
      }
    });
  });

  /* GET Photos */
  // ------------------------
  // ------------------------
  router.route('/tutors/photo/:tutor_id').get( function(req, res) {
    console.log('PHOTO');
    console.log(req.params.tutor_id);
    Tutor.findById(req.params.tutor_id).select({"photo":1}).exec((err, tutors) => {
      if (err) {
        res.send('err')
      }
      else {
        res.json(tutors);
      }
    });
  });


  /* GET Photos */
  // ------------------------
  // ------------------------
  router.route('/tutors/photo_raw/:tutor_id').get( function(req, res) {
    console.log('PHOTO');
    console.log(req.params.tutor_id);
    Tutor.findById(req.params.tutor_id).select({"photo":1}).exec((err, tutors) => {
      if (err) {
        res.send('err')
      }
      else {
        if (tutors) {
            res.json(tutors.photo);
        }

      }
    });
  });

  // ------------------------
  // ------------------------
  // ------------------------
  /*  GEO-Search Tutors */
  // ------------------------
  // ------------------------
  router.route('/tutors/geosearch').post( function(req, res) {
    console.log('TUTOR SEARCH');
    console.log(req.body);
    console.log('--------------');
    // Log search in db
    SearchStats.create({
      date: Date.now(),
      eventName: "tutorGeoSearch",
      query: req.body
    });

    // Find all tutors and look at their distance to the search input
    Tutor.find({activeTutor:true}).select({"photo":0,"local":0}).exec((err, tutors) => {
      if (err) {
        console.log(err);
        res.send('err');
      }
      else {
        console.log('No Erros');
        // Search for tutor search conditions and add to results
        console.log('  --  Searching Each Tutor  --');
        // console.log(tutors);

        // Keep record of positive results
        var geoTutorResults = [];
        var count = 0;
        tutors.forEach((tutor, index)=>{
          // Try without removing photos {"photo":0}
          Tutor.findById(tutor._id).select({"photo":0,"local":0}).exec((err, tutor) => {
              if (err) {
                console.log('Error');
              }
              else {
                // console.log('Service Distance Miles: ' + tutor.location.serviceDistance);
                // console.log('meters: ' + (tutor.location.serviceDistance * 1609.34));
                // perform geosearch
                // 1609.34 meters per mile
                  Tutor.find({ _id: tutor._id, 'geoCoded.geo.location.coordinates':
                    { $near :
                      { $geometry:
                        { type: "Point",  coordinates: [ parseFloat(req.body.coordinatesX), parseFloat(req.body.coordinatesY) ] },
                          $maxDistance: (tutor.location.serviceDistance * 1609.34)
                          // $maxDistance: (20000)
                      }
                    }
                  }).select({}).exec((err, validTutor) => {
                    // validTutor contains the geoquery result for the tutorID.
                    // If successful then it will only have one result
                    if (err) {
                      console.log(err);
                    }
                    else {
                      // If there is a result, start searching for the SearchWord in their profile
                      if (validTutor.length > 0) {
                        // keep track if tutor is added to return results
                        var tutorNotAdded = true;
                        // console.log('  --  Tutor is within search  --');
                        // console.log(validTutor);
                        // - - - - - - - - - -

                        // Check for partial bio match
                        if (validTutor[0].bio.toLowerCase().includes(req.body.subject.toLowerCase())) {
                          if (tutorNotAdded) {
                            console.log('  --  * Subject * GeoMatch');
                              geoTutorResults.push(validTutor[0]);
                              // console.log(geoTutorResults);
                              tutorNotAdded = false;
                          }
                        }
                        //  see if the tutor has any subjects if the tutor has not been added
                        if (req.body.subject && tutorNotAdded) {
                          // then check for subject match
                          validTutor[0].subjects.forEach((subject)=>{
                            // Check for any partial match on the subjectCategory
                            if (subject.subjectCategory.toLowerCase().includes(req.body.subject.toLowerCase())) {
                              if (tutorNotAdded) {
                                console.log('  --  * Subject * GeoMatch');
                                  geoTutorResults.push(validTutor[0]);
                                  // console.log(geoTutorResults);
                                  tutorNotAdded = false;
                              }
                            }
                            // Check for any partial match on classes
                            else if ( subject.classes.toLowerCase().includes(req.body.subject.toLowerCase()) ) {
                              if (tutorNotAdded) {
                                console.log('  --  * Classes * GeoMatch');
                                  geoTutorResults.push(validTutor[0]);
                                  // console.log(geoTutorResults);
                                  tutorNotAdded = false;
                              }
                            }
                          });
                        }
                      }
                    }
                    // Increase count by one
                    count += 1;
                    // See if we are done searching all tutors
                    if (count == tutors.length) {
                      console.log('  --  Results Are in  ----');
                      res.json(geoTutorResults);
                    }
                  });
                  // end geosearch query section
              }
            });
          });
      }
    });
  });
  // -----------------------
  // End geosearch
  // -----------------------


  // - - - - - - - - - - - - - - - - -
  /*  Search Tutors ** GENERIC ** */
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/search').post( function(req, res) {
    console.log('TUTOR SEARCH');

    SearchStats.create({
      date: Date.now(),
      eventName: "tutorSearch",
      query: req.body
    });

    Tutor.find({}).select({"local":0}).exec((err, tutors) => {
      if (err) {
        console.log(err);
        res.send('err');
      }
      else {
        console.log('No Erros');
        // Search for tutor search conditions and add to results
        console.log('zip: ' + req.body.zip);
        console.log('subject: ' + req.body.subject);

        var tutorResults = [];
        var tutorNotAdded = true;

        tutors.forEach((tutor, index) => {
          // reset this tutors add status
          tutorNotAdded = true;
          // check for zip code
          if ( tutor.location.zip.includes(req.body.zip) ){
            // then check for subject match
            tutor.subjects.forEach((subject)=>{
              if (subject.subjectCategory.toLowerCase().includes(req.body.subject.toLowerCase())) {
                if (tutorNotAdded) {
                    tutorResults.push(tutor);
                    tutorNotAdded = false;
                }
              }
            });
          }
        });
        res.json(tutorResults);
      }
    });
  });

  // - - - - - - - - - - - - - - - - -
  /*  Search Tutors ** Name ** */
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/search/name').post( function(req, res) {

    SearchStats.create({
      date: Date.now(),
      eventName: "tutorNameSearch",
      query: req.body
    });

    var nameSearch = req.body.name.split(' ');

    Tutor.find({activeTutor:true}).select({"local":0}).exec((err, tutors) => {
      if (err) {
        console.log(err);
        res.send('err');
      }
      else {
        console.log('No Erros');
        // Search for tutor search conditions and add to results
        var tutorResults = [];
        var tutorNotAdded = true;

        tutors.forEach((tutor, index) => {
          // reset this tutors add status
          tutorNotAdded = true;
          // for each word in name search
          nameSearch.forEach((nameItem, nameIndex)=>{
            // check for a firstname
            if (tutor.firstName) {
              if ( tutor.firstName.toLowerCase().includes( nameItem.toLowerCase()) ) {
                if (tutorNotAdded) {
                    tutorResults.push(tutor);
                    tutorNotAdded = false;
                }
              }
            }
            // check for nickname
            if (tutor.nickname) {
              if ( tutor.nickname.toLowerCase().includes(nameItem.toLowerCase()) ) {
                 if (tutorNotAdded) {
                     tutorResults.push(tutor);
                     tutorNotAdded = false;
                 }
               }
            }
          });
        });
        // End tutor forEach
        res.json(tutorResults);
      }
    });
  });

  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  /*  Search ** ONLINE ** Tutors */
  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/search/online').post( function(req, res) {

    SearchStats.create({
      date: Date.now(),
      eventName: "tutorOnlineSearch",
      query: req.body
    });


    // Search for online tutors
    Tutor.find({onlineTutor:true, activeTutor:true}).select({"local":0}).exec((err, tutors) => {
      if (err) {
        console.log(err);
        res.send('err');
      }
      else {
        console.log('Online Tutor Search');
        // Search for tutor search conditions and add to results
        console.log('subject: ' + req.body.subject);

        var tutorResults = [];
        var tutorNotAdded = true;

        tutors.forEach((tutor, index) => {
          // reset this tutors add status
          tutorNotAdded = true;
          // Check for subject match
          tutor.subjects.forEach((subject)=>{
            if (subject.subjectCategory.toLowerCase().includes(req.body.subject.toLowerCase())) {
              if (tutorNotAdded) {
                  tutorResults.push(tutor);
                  tutorNotAdded = false;
              }
            }
          });
        });
        // Return online tutors matching subject back to client
        res.json(tutorResults);
      }
    });
    // end tutor find

  });



  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  /* GET Tutor Subjects */
  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/subjects').get( function(req, res) {
    Tutor.find((err, tutors) => {
      if (err) {
        res.send('err')
      }
      else {
        var subjects = [];
        if (tutors.length > 0 ) {
          tutors.forEach((tutor, index)=>{
            tutor.subjects.forEach((subject)=>{
              subjects.push(subject);
            });
          });
        }
        res.json(subjects);
      }
    });
  });

  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  /* Create Tutors */
  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors').post( function(req, res) {
    // Create new tutor schema
    var newTutor = {
      applyNotificaiton: false,
      activeTutor: req.body.activeTutor,
      onlineTutor: req.body.onlineTutor,
      name: striptags(req.body.firstName + " " +req.body.lastName),
      firstName: striptags(req.body.firstName),
      lastName: striptags(req.body.lastName),
      nickname: striptags(req.body.nickname),
      profileVideo: striptags(req.body.profileVideo),
      bio: striptags(req.body.bio),
      shortBio: striptags(req.body.shortBio),
      rate: Number((req.body.payRate * 2) + 5),
      payRate: Number(req.body.payRate),
      // subjects: req.body.subjects,
      education: striptags(req.body.education),
      location: {
        zip: striptags(req.body.location.zip),
        serviceDistance: Number(req.body.location.serviceDistance),
      },
      geoCoded: req.body.geoCoded,
      contact: {
        phone: striptags(req.body.contact.phone),
        email: striptags(req.body.contact.email)
      },
      schedule: striptags(req.body.schedule),
      photo: striptags(req.body.photo)
    };

    console.log('  --  new tutor');
    console.log(newTutor.geoCoded);

    // add subjects to tutor profile
    newTutor.subjects = [];
    req.body.subjects.forEach((item)=>{
      var newSubjectCateogry = null;
      // check for custom category
      if (item.subjectCategory == "Add Custom Subject") {
        newSubjectCateogry = toTitleCase(striptags(item.customSubject))
      }
      else {
        newSubjectCateogry = striptags(item.subjectCategory)
      }
      newTutor.subjects.push({
        subjectCategory: newSubjectCateogry,
        classes: striptags(item.classes)
      });
    });

    console.log(newTutor);

    Tutor.create(newTutor, (err, tutor) => {
      if (err) {
        console.log(' -- Create New Tutor Error');
        console.log(err);
        res.send('err')
      }
      else {
        Tutor.find((err, tutors) => {
          if (err) {
            res.send('err')
          }
          res.json(tutors);
        });
      }
    });
  });

  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  /* Update Tutor */
  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/:tutor_id').put( function(req, res) {
    Tutor.findById(req.params.tutor_id, (err, tutor) => {
      if (err) {
        res.send('err')
      }

      // check to see if the local 'login' email address is already used
      validEmail(striptags(req.body.local.email), tutor._id, (emailCheck)=>{
        console.log(emailCheck);
        console.log('CALLBACK');
        if ( emailCheck ) {
          console.log('YES YES YES');
          // --------------
          // start tutor update and save
          //update tutor info
          tutor.applyNotificaiton = req.body.applyNotificaiton;
          tutor.partyHost = req.body.partyHost;
          tutor.activeTutor = req.body.activeTutor;
          tutor.onlineTutor = req.body.onlineTutor;
          tutor.name = striptags(req.body.firstName + " " +req.body.lastName);
          tutor.firstName = striptags(req.body.firstName);
          tutor.lastName = striptags(req.body.lastName);
          tutor.nickname = striptags(req.body.nickname),
          tutor.bio = striptags(req.body.bio);
          tutor.shortBio = striptags(req.body.shortBio);
          tutor.rate =  Number((req.body.payRate * 2) + 5),
          tutor.payRate =  Number(req.body.payRate),
          tutor.education = striptags(req.body.education);
          tutor.location.zip = striptags(req.body.location.zip);
          tutor.contact.phone = striptags(req.body.contact.phone);
          tutor.contact.email = striptags(req.body.contact.email);
          tutor.schedule = striptags(req.body.schedule);
          tutor.local.email = striptags(req.body.local.email);

          // youtube profile
          tutor.profileVideo = striptags(req.body.profileVideo);

          // If there is a new Service distance
          if (req.body.location.serviceDistance != null && req.body.location.serviceDistance != "null") {
            tutor.location.serviceDistance = Number(req.body.location.serviceDistance);
          }
          // If there is a new formmatted address, update the geocode
          if (req.body.geoCoded.formatted_address) {
              tutor.geoCoded = req.body.geoCoded;
          };


          // add subjects
          tutor.subjects = [];
          req.body.subjects.forEach((item)=>{
            var newSubjectCateogry = null;
            // check for custom category
            if (item.subjectCategory == "Add Custom Subject") {
              newSubjectCateogry = toTitleCase(striptags(item.customSubject))
            }
            else {
              newSubjectCateogry = striptags(item.subjectCategory)
            }

            // console.log('- - - - - - - - ');
            // console.log(toTitleCase("hello world"));
            // console.log(typeof striptags(item.customSubject));
            // console.log('- - - - - - - - ');
            // console.log('- - - - - - - - ');
            // console.log('- - - - - - - - ');
            // console.log('CUSTOM SUBJECT');
            // console.log(newSubjectCateogry);


            tutor.subjects.push({
              subjectCategory: newSubjectCateogry,
              classes: striptags(item.classes)
            });
          });

          console.log('Tutor');
          // console.log(tutor);

          if (req.body.photo != null) {
            tutor.photo = striptags(req.body.photo);
            console.log('PHOTO PRESENT');
          }
          else {
            console.log('No New Photo in update');
          }

          tutor.save((err) => {
            if (err) {
              console.log('ERROR TUTOR SAVE: ');
              console.log(err);
              res.send('err');
            }
            else {
              Tutor.find((err, tutors) => {
                if (err) {
                  console.log('ERROR TUTOR FIND: ');
                  console.log(err);
                  res.send('err')
                }
                else {
                  res.json(tutors);
                }
              });
              console.log('Tutor Updated');
            }
          });

          // - - - - - - - - -
          // end tutor update and save
          // - - - - - - - - -
        }
        else {
          console.log('Duplicate email for local.email');
          res.send('duplicate');
        }
      });





      // end tutor.find
    });
  });

  // - - - - - - - - - - - - - - - - -
  /* Validate Tutor */
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/validate/:tutor_id').put( function(req, res) {
    console.log('VALIDATING');
    console.log(req.params.tutor_id);

    Tutor.findById(req.params.tutor_id, (err, tutor) => {
      if (err) {
        res.send('err')
      }
      else {

        // Create a username and password
        var newPass =  uuidv4().slice(9,18);


        // reset password
        tutor.local = {
          email: tutor.contact.email.toLowerCase(),
          password: tutor.generateHash(newPass)
        };

        // console.log('NEW ACCOUNT PRE SAVE');
        // console.log(tutor.local.email);

        // set active and remove 'applyNotificaiton'
        tutor.activeTutor = true;
        tutor.applyNotificaiton = false;

        // save tutor
        tutor.save((err) => {
          if (err) {
            console.log('ERROR Creating online tutor save ');
            console.log(err);
            res.json({message:'err'})
          }
          else {
            // mail user notification
            // MAILBOT NOTIFICATION
            if (serverEnvironment == 'local_sandbox') {
              console.log('EMAIL SANDBOX');
              Mailbot.emailValidationWelcome(tutor.contact.email, newPass);
            }
            else if (serverEnvironment == 'aws_sandbox') {
              console.log('EMAIL * * AWS * *');
              Mailbot.emailValidationWelcome(tutor.contact.email, newPass);
            }
            else if (serverEnvironment == 'production') {

              console.log('EMAIL * * PRODUCTION * *');
              Mailbot.emailValidationWelcome(tutor.contact.email, newPass);
            }

            res.json({message:'success'})
            console.log('Tutor Updated');
          }
        }); // end tutor save
      } //end error else

    });
  });

  // - - - - - - - - - - - - - - - - -
  /* Delete Tutor */
  // - - - - - - - - - - - - - - - - -
  router.route('/tutors/:tutor_id').delete( function(req, res) {
    Tutor.remove({_id:req.params.tutor_id}, (err, tutor) => {
      if (err) {
        res.send('err')
      }
      Tutor.find((err, tutors) => {
        if (err) {
          res.send('err')
        }
        res.json(tutors);
      });
    });
  });

  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  /* Online Application Tutors */
  // - - - - - - - - - - - - - - - - -
  router.route('/apply/tutor').post( function(req, res) {

    var notifyAdminCustomSubject = false;


    var newTutor = {
      applyNotificaiton: true,
      activeTutor: false,
      onlineTutor: req.body.onlineTutor,
      firstName: striptags(req.body.firstName),
      lastName: striptags(req.body.lastName),
      name: striptags(req.body.firstName + " " + req.body.lastName),
      nickname: striptags(req.body.nickname),
      bio: striptags(req.body.bio),
      shortBio: striptags(req.body.shortBio),
      rate: Number((req.body.payRate * 2) + 5),
      payRate: Number(req.body.payRate),

      // subjects: req.body.subjects,
      education: striptags(req.body.education),
      location: {
        zip: striptags(req.body.location.zip),
        serviceDistance: parseFloat(req.body.location.serviceDistance),
      },
      geoCoded: req.body.geoCoded,
      contact: {
        phone: striptags(req.body.contact.phone),
        email: String(striptags(req.body.contact.email)).toLowerCase()
      },
      schedule: striptags(req.body.schedule),
      photo: striptags(req.body.photo),
      comments: striptags(req.body.comments),
      partyHost: req.body.partyHost
    };

    console.log('  --  new tutor application Submit !');
    // console.log(newTutor.geoCoded);

    // add subjects to tutor profile
    newTutor.subjects = [];
    req.body.subjects.forEach((item)=>{

      var newSubjectCateogry = null;
      // check for custom category
      if (item.subjectCategory == "Add Custom Subject") {
        newSubjectCateogry = toTitleCase(striptags(item.customSubject));
        notifyAdminCustomSubject = true;
      }
      else {
        newSubjectCateogry = striptags(item.subjectCategory)
      }
      // add the proper information to Subject List
      newTutor.subjects.push({
        subjectCategory: newSubjectCateogry,
        classes: striptags(item.classes)
      });
    });

    // console.log(newTutor);

    Tutor.create(newTutor, (err, tutor) => {
      if (err) {
        console.log(' -- Create New Tutor Error');
        console.log(err);
        res.send('err')
      }
      else {
        // MAILBOT NOTIFICATION
        if (serverEnvironment == 'aws_sandbox' || serverEnvironment == 'local_sandbox') {
          // console.log('EMAIL SANDBOX');
          Mailbot.emailAdminApplication("jwoodjack@gmail.com", newTutor);
          // check for custom subject
          if (notifyAdminCustomSubject) {
            Mailbot.emailAdminNewSubject("jwoodjack@gmail.com", newTutor);
          }
        }
        else if (serverEnvironment == 'production') {
          // Mailbot.emailAdminApplication("jwoodjack@gmail.com", newTutor);
          // console.log('EMAIL * * PRODUCTION * *');
          Mailbot.emailAdminApplication("badasstutors2015@gmail.com", newTutor);
          // check for custom subject
          if (notifyAdminCustomSubject) {
            Mailbot.emailAdminNewSubject("badasstutors2015@gmail.com", newTutor);
          }
        }

        res.send("success");
      }
    });
  });
  // - - - - - - - -- - - - - - - - -
  // *** END APPLY/TUTORS * * * *
  // - - - - - - - -- - - - - - - - -




  // - - - - - - - - - - - - - -
  /*   - - - * Update Purchase * - - - - - -  */
  // - - - - - - - - - - - - - -
  router.route('/purchase/update').post( function(req, res) {
    console.log(' Admin Purchase Update POST ---- #### -----');
    // console.log(req.body);

    // findPurchase
    Purchase.findById(req.body._id).exec((err, purchase) => {
      if (err) {
        res.send('err')
      }
      else {
        console.log('Found Purchases');
        // console.log(purchase);

        // update purchase
        purchase.cart = req.body.cart;
        purchase.purchaseComplete = req.body.purchaseComplete;

        if (purchase.formData.email != req.body.formData.email) {
          purchase.formData.email = req.body.formData.email;
        }

        // save purchase
        purchase.save((err) => {
          if (err) {
            console.log('ERROR TUTOR SAVE: ');
            console.log(err);
            res.json({message:'err'})
          }
          else {

            console.log('Purchase Update Complete');
            console.log('* * * * * * * * * * * * * *');
            res.json({message:"success"});
          }
        });
      }
    });
    // update purchase
  });


  return router;
};
