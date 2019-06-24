var express = require('express');
var router = express.Router();
var path = require('path');
// const moment = require('moment');
const striptags = require('striptags');

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Purchase = require('./models/purchase');
const Tutor = require('./models/tutors');
const Blog = require('./models/blog');
// Mailbot
const Mailbot = require('./models/mailbot.js')();

// Secure random generator
const uuidv4 = require('uuid/v4');
// uuidv4();

const moment = require('moment');


// Title Case Function
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


module.exports = function(passport, serverEnvironment) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    router.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/index.html'));
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    router.get('/login', function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/login.html'));
    });

    // process the login form
    // router.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    router.get('/signup', function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/signup.html'));
    });

    // =====================================
    // Password reset ==============================
    // =====================================
    // show the signup form
    router.get('/forgot-password', function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/passwordReset.html'));
    });

    // process the signup form
    // router.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use router middleware to verify this (the isLoggedIn function)
    router.get('/profile', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/profile.html'));
    });

    router.get('/settings', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/settings.html'));
    });

    router.get('/help', isLoggedIn, function(req, res) {
    // router.get('/help', function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/help.html'));
    });

    router.get('/tutoring', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/tutoring.html'));
    });

    router.get('/historical', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/historical.html'));
    });

    router.get('/blog', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/blog.html'));
    });

    router.get('/newblog', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '/views/tutor/newBlog.html'));
    });

    router.get('/profile/data', isLoggedIn, function(req, res) {
        console.log('USER');
        console.log(req.user);
        res.json(req.user);
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('./login');
    });

    // * * * * * * * * * * * * * * * * * * * *
    // * * * * *  GET API  * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * *


    // * * * * * * * * * * * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * *
    router.get('/myID', isLoggedIn, function(req, res) {
      // find this tutors students
      res.json({id:String(req.user._id)})
    });


    // * * * * * * * * * * * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * *
    router.get('/students/list/active', isLoggedIn, function(req, res) {
      // find this tutors students
      // console.log('Tutor ID: ' );
      // console.log('5a9b31521dee0448722a1b35');
      // console.log(req.user._id);
      // console.log('5a9b31521dee0448722a1b35' == req.user._id);
      // console.log(typeof req.user._id);

      // Purchase.find({ 'cart.assignedTutors.tutorID' : req.user._id, purchaseComplete:false }).sort({date:-1}).exec((err, students) => {
      // Purchase.find({ 'cart.assignedTutors.tutorID' : String(req.user._id), purchaseComplete:false }).sort({date:-1}).exec((err, students) => {

      Purchase.find({ 'cart.assignedTutors.tutorID' : {$in:[String(req.user._id), req.user._id]}, purchaseComplete:false }).sort({date:-1}).exec((err, students) => {
        if (err) {
          console.log('Student Search Error');
          console.log(err);
        }
        else {
          console.log('Found students, searching');
          console.log(students);
          // loop and find in cart and user id matches
          var resultStudents = [];
          // console.log(students);


          // go through and calculate your available hours;
          students.forEach((purchase, purchaseIndex)=>{
            purchase.cart.forEach((lineItem, cartIndex)=>{
              var tutorLoggedHours = 0;
              var loggedHoursTotal = 0;
              if (lineItem.loggedHours) {
                  lineItem.loggedHours.forEach((log, logIndex)=>{
                    if (log.tutorID == req.user._id) {
                      tutorLoggedHours += log.hours;
                    }
                    // log all hours
                    loggedHoursTotal += log.hours;
                  });
              }
              students[purchaseIndex].cart[cartIndex].loggedHoursLeft = (students[purchaseIndex].cart[cartIndex].hours - loggedHoursTotal);
              students[purchaseIndex].cart[cartIndex].tutorLoggedHours = tutorLoggedHours;
              students[purchaseIndex].cart[cartIndex].loggedHoursTotal = loggedHoursTotal;
            });
          });

          // send
          res.json(students);

        }
      });
    });

    // * * * * * * * * * * * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * *
    router.get('/students/list/historical', isLoggedIn, function(req, res) {
      // find this tutors students
      console.log('Tutor ID: ' );
      console.log('5a9b31521dee0448722a1b35');
      console.log(req.user._id);
      console.log('5a9b31521dee0448722a1b35' == req.user._id);
      console.log(typeof req.user._id);

      Purchase.find({ 'cart.assignedTutors.tutorID' : String(req.user._id), purchaseComplete:true }).select({}).exec((err, students) => {
        if (err) {
          console.log('Student Search Error');
          console.log(err);
        }
        else {
          console.log('Found students, searching');
          // loop and find in cart and user id matches
          var resultStudents = [];
          // console.log(students);

          // send
          res.json(students);

        }
      });
    });

    // =====================================
    // * * * * * * * * * * * * * * * * * * * *
    // * * * * *  BLOG  * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * *
    // router.get('/blog/list', isLoggedIn, function(req, res) {
    //   console.log(req.user._id);
    //
    //   Blog.find({'author.id':req.user._id}).sort({c_Date:-1}).exec((err, blogs)=>{
    //     res.json(blogs);
    //   });
    // });
    //
    // /*   - - - Edit BLOG HTML - - - GET - - -  */
    // router.get('/editblog/:blogID', isLoggedIn, function(req, res, next) {
    //   console.log('request');
    //
    //   res.sendFile(path.join(__dirname, '/views/tutor/editBlog.html'));
    // });
    //
    // router.post('/blog/new', isLoggedIn, function(req, res) {
    //   console.log('new blog');
    //
    //   console.log(req.body);
    //   // console.log('DATE');
    //   // console.log(req.body.creationDate);
    //   // console.log( Date(req.body.creationDate) );
    //   // console.log(typeof req.body.creationDate);
    //
    //   var newPost = {
    //     c_Date: Date.now(),
    //     creationDate: moment().format('l'),
    //     author: {
    //       name: req.user.firstName,
    //       id: req.user._id,
    //       nickname: req.user.nickname
    //     },
    //     post_title: req.body.post_title,
    //     post_content: striptags(req.body.post_content)
    //   };
    //
    //   Blog.create(newPost, (err, post) => {
    //     if (err) {
    //       console.log('-- Create new post error');
    //       console.log(err);
    //       res.json({message:"error"})
    //     }
    //     else {
    //       res.json({message:"success"})
    //     }
    //   })
    // });
    //
    // router.post('/blog/edit', isLoggedIn, function(req, res) {
    //   console.log('new blog');
    //   console.log(req.body);
    //
    //   Blog.findById(req.body.blogID).exec((err, blog) => {
    //     if (err) {
    //       res.send('err')
    //     }
    //     else {
    //       // set new fields
    //       blog.post_title = req.body.post_title;
    //       blog.post_content = striptags(req.body.post_content);
    //
    //       // save
    //       blog.save((err)=>{
    //         if (err) {
    //           console.log('edit blog post error');
    //           res.json({message:"error"});
    //         }
    //         else {
    //           res.json({message:"success"});
    //         }
    //       });
    //     }
    //   });
    // });
    //
    // router.post('/blog/delete/:blogID', isLoggedIn, function(req, res) {
    //   console.log('new blog');
    //   console.log(req.params);
    //
    //   Blog.remove({_id:req.params.blogID}, (err)=>{
    //     if (err) {
    //       console.log('Delete Blog error');
    //       res.json({message:"error"});
    //     }
    //     else {
    //       res.json({message:"success"});
    //     }
    //   })
    // });








    // =====================================
    // =====================================
    // =====================================
    // * * * * * * * * * * * * * * * * * * * *
    // * * * * *  POST  * * * * * * * * * *
    // * * * * * * * * * * * * * * * * * * * *
    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : './profile', // redirect to the secure profile section
        failureRedirect : './signup' // redirect back to the signup page if there is an error
    }));

    router.post('/login', function(req, res, next) {
      console.log(req.body);
      console.log('LOGIN');
      passport.authenticate('local-login', function(err, user, info) {
        // console.log('---ERR');
        // console.log(err);
        // console.log('---USER');
        // console.log(user);
        // console.log('---INFO');
        // console.log(info);
        if (err) {
          console.log('ERROR');
          return next(err);
        }
        if (!user) {
          console.log('NO USER');
          return res.json(info);
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.json({message:'success'});
        });
      })(req, res, next);
    });


    // =====================================
    // forgot Password ==============================
    // =====================================
    router.post('/forgotPassword', function(req, res) {

        console.log('reset password');
        // lookup email for accout
        console.log(req.body.email);
        // Tutor.find()
        Tutor.findOne({'local.email':req.body.email}).select({}).exec((err, tutor) => {
          if (err) {
            console.log(err);
            res.send({message: 'error'});
          }
          else {
            if (tutor) {
              console.log('RESULTS');
              // console.log(tutor);

              // generate random hash
              var newPass =  uuidv4().slice(9,18);
              console.log(newPass);

              // reset password
              tutor.local.password = tutor.generateHash(newPass);

              // Save user back to db
              tutor.save(function(err) {
                  if (err){
                    console.log('SAVE TUTOR PASSWORD RESET ERROR');
                    console.log(err);
                    res.send({message: 'error'});
                  }
                  else {
                    res.send({message: 'success'});
                    // email user new password
                    // console.log('TUTOR ACCOUNT FOUDN AND EMAIL SENT');
                    Mailbot.emailPasswordReset(tutor.contact.email, newPass);
                  }
              });
              // End Tutor save
            }
            else {
              res.send({message: 'no user'});
            }
          }
        });
    });



    // ***********************************
    // ***********************************
    // ***********************************
    // API
    // ***********************************
    // - - - - - - - - - - - - - - - - -
    /* Update Tutor */
    // - - - - - - - - - - - - - - - - -
    router.post('/update', isLoggedIn, function(req, res) {
      console.log('Tutor Profile Update Begin');
      var notifyAdminCustomSubject = false;

      Tutor.findById(req.user._id, (err, tutor) => {
        if (err) {
          res.send('err')
        }

        //update tutor info
        tutor.applyNotificaiton = req.body.applyNotificaiton;
        tutor.partyHost = req.body.partyHost;
        tutor.onlineTutor = req.body.onlineTutor;
        tutor.name = striptags(req.body.firstName + " " +req.body.lastName);
        tutor.firstName = striptags(req.body.firstName);
        tutor.lastName = striptags(req.body.lastName);
        tutor.nickname = striptags(req.body.nickname),
        tutor.bio = striptags(req.body.bio);
        tutor.shortBio = striptags(req.body.shortBio);
        tutor.rate =  Number((req.body.payRate * 2) + 5);
        tutor.payRate =  Number(req.body.payRate);
        tutor.education = striptags(req.body.education);
        tutor.location.zip = striptags(req.body.location.zip);
        tutor.contact.phone = striptags(req.body.contact.phone);
        tutor.contact.email = striptags(req.body.contact.email);
        tutor.schedule = striptags(req.body.schedule);
        tutor.comments = striptags(req.body.comments);

        // check for profile video
        tutor.profileVideo = striptags(req.body.profileVideo);
        if ( tutor.profileVideo ) {

        }


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
            newSubjectCateogry = toTitleCase(striptags(item.customSubject));
            notifyAdminCustomSubject = true;
          }
          else {
            newSubjectCateogry = striptags(item.subjectCategory)
          }
          // add the proper information to Subject List
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

        // Set active to in-active so Robb must approve
        // tutor.activeTutor = false;

        tutor.save((err) => {
          if (err) {
            console.log('ERROR TUTOR SAVE: ');
            console.log(err);
            res.send({message:'error'});
          }
          else {
            // send email to admin about update
            if (serverEnvironment == 'local_sandbox') {
              Mailbot.emailAdminTutorProfileChange("jwoodjack@gmail.com",tutor);
              // check for custom subject
              if (notifyAdminCustomSubject) {
                Mailbot.emailAdminNewSubject("jwoodjack@gmail.com", tutor);
              }
            }
            else if (serverEnvironment == "production") {
              // check for custom subject
              if (notifyAdminCustomSubject) {
                Mailbot.emailAdminNewSubject("badasstutors2015@gmail.com", tutor);
              }
              // Mailbot.emailAdminTutorProfileChange("badasstutors2015@gmail.com",tutor);
            }


            Tutor.find((err, tutors) => {
              if (err) {
                console.log('ERROR TUTOR FIND: ');
                console.log(err);
                res.send({message:'error'});
              }
              else {
                  res.send({message:'success'});
              }
            });
            console.log('Tutor Updated');
          }
        });
      });
    });
    // ********************************
    // End Update Tutor
    // ********************************




    // ********************************
    // Passwrod Reset
    // ********************************
    router.post('/password-reset', isLoggedIn,  function(req, res) {
        console.log('Password Reset');
        console.log(req.user);
        console.log('NEW PASSWORD');
        console.log(req.body);

        // Find user in db
        // Tutor.find()
        Tutor.findOne({'local.email':req.user.local.email}).select({}).exec((err, tutor) => {
          if (err) {
            console.log(err);
            res.send({message: 'error'});
          }
          else {
            console.log('RESULTS');
            console.log(tutor);
            tutor.local.password = tutor.generateHash(req.body.pass1);
            // Save user back to db
            tutor.save(function(err) {
                if (err){
                  console.log('SAVE TUTOR PASSWORD RESET ERROR');
                  console.log(err);
                  res.send({message: 'error'});
                }
                else {
                  res.send({message: 'success'});
                }
            });
          }
        });
    });
    // ********************************
    // End password reset
    // ********************************


    // ********************************
    // Log hours
    // ********************************
    router.post('/log-hours', isLoggedIn,  function(req, res) {

        // check for match of tutor ID
        if (req.user._id != req.body.log.tutorID) {
          console.log('NO MATCH OF TUTOR MAKING HOUR LOG');
        }
        else {
          // find the purhcase
          Purchase.findById(req.body.purchaseID).select({}).exec((err, updatePurchase) => {
            if (err) {
              console.log('ERROR');
              console.log(err);
            }
            else {
              // check for loggedTutors Array
              if (!updatePurchase.cart[req.body.cartIndex].loggedHours) {
                console.log('No existing hours');
                updatePurchase.cart[req.body.cartIndex].loggedHours = [];
              }
              else {
                console.log('Hours already exist');
              }
              // update log date to actual date
              req.body.log.realDate = moment(req.body.log.date, 'YYYY-MM-DD').format('LL');
              console.log('DATE');
              console.log('* * * * * * * * * * * *');
              console.log(req.body.log.realDate);
              console.log('* * * * * * * * * * * *');

              // push to loggedTutors array
              updatePurchase.cart[req.body.cartIndex].loggedHours.push(req.body.log);
              // calculate loggedHoursLeft
              updatePurchase.cart[req.body.cartIndex].loggedHoursLeft = updatePurchase.cart[req.body.cartIndex].hours;
              updatePurchase.cart[req.body.cartIndex].loggedHours.forEach((log, logIndex)=>{
                updatePurchase.cart[req.body.cartIndex].loggedHoursLeft -= log.hours;
              });

              // then save and respond success
              //
              //
              // send email to admin about update
              if (serverEnvironment == 'local_sandbox') {

                Mailbot.emailAdminLoggedHours("jwoodjack@gmail.com", req.body.log, updatePurchase);
                // Mailbot.emailStudentLoggedHours(req.body.log, updatePurchase);

                // Test
                // res.json({message:"success"});


              }
              else if (serverEnvironment == "production") {
                // check for custom subject
                Mailbot.emailAdminLoggedHours("badasstutors2015@gmail.com", req.body.log, updatePurchase);
                // Mailbot.emailAdminLoggedHours("jwoodjack@gmail.com", req.body.log, updatePurchase);
                Mailbot.emailStudentLoggedHours(req.body.log, updatePurchase);
              }
            // - - - - - - - - - -
            // - - - - - - - - - -
            // - - - - - - - - - -

              // update purchase
              // - - - - - - -
              Purchase.update({_id:req.body.purchaseID}, {cart:updatePurchase.cart}, (err, numberAffected, rawResponse)=>{
                if (err) {
                  console.log('UPDATE ERR');
                  console.log(err);
                  res.json({message:"error"});
                }
                else {
                  // if on

                  res.json({message:"success"});
                }
              });
              // - - - - - - -
              // End update purchase

            }
          }); // end purchase findById
        }
    });
    // ********************************
    // End log hours
    // ********************************





    return router;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/tutor/login');
}
