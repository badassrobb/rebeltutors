// apiRoutes.js

// Setup
var express = require('express');
var router = express.Router();
var path = require('path');
const striptags = require('striptags');
// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Tutor = require('./models/tutors');
const SearchStats = require('./models/searchStats');


/* GET Tutors */
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
router.route('/tutors/nophotos').get( function(req, res) {
  Tutor.find({}).select({"photo":0}).exec((err, tutors) => {
    if (err) {
      res.send('err')
    }
    else {
      res.json(tutors);
    }
  });
});

/* GET Photos */
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

/*  Search Tutors */
router.route('/tutors/search').post( function(req, res) {
  console.log('TUTOR SEARCH');

  SearchStats.create({
    date: Date.now(),
    eventName: "tutorSearch",
    query: req.body
  });

  Tutor.find({}).select({}).exec((err, tutors) => {
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

      tutors.forEach((tutor) => {
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
        // else if ( tutor.location.zip.includes(req.body.zip) ) {
        //   tutorResults.push(tutor);
        // }
      });
      res.json(tutorResults);
    }
  });
});

/* GET Tutor Zip */
router.route('/tutors/zip').get( function(req, res) {
  Tutor.find((err, tutors) => {
    if (err) {
      res.send('err')
    }
    else {
      var zips = [];
      if (tutors.length > 0 ) {
        tutors.forEach((tutor, index)=>{
          tutor.locations.forEach((zip)=>{
            zips.push(zip);
          });
        });
      }
      res.json(zips);
    }
  });
});

/* GET Tutor Subjects */
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

/* Create Tutors */
router.route('/tutors').post( function(req, res) {
  console.log('');


  var newTutor = {
    name: striptags(req.body.name),
    nickname: striptags(req.body.nickname),
    bio: striptags(req.body.bio),
    shortBio: striptags(req.body.shortBio),
    rate: striptags(req.body.rate),
    // subjects: req.body.subjects,
    education: striptags(req.body.education),
    location: {
      zip: striptags(req.body.location.zip),
      serviceDistance: striptags(req.body.location.serviceDistance)
    },
    contact: {
      phone: striptags(req.body.contact.phone),
      email: striptags(req.body.contact.email)
    },
    schedule: striptags(req.body.schedule),
    photo: striptags(req.body.photo)
  };

  console.log('new tutor');
  console.log(newTutor);

  // add subjects to tutor profile
  newTutor.subjects = [];
  req.body.subjects.forEach((item)=>{
    newTutor.subjects.push({
      subjectCategory: striptags(item.subjectCategory),
      classes: striptags(item.classes)
    });
  });

  console.log(newTutor);

  Tutor.create(newTutor, (err, tutor) => {
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

/* Update Tutor */
router.route('/tutors/:tutor_id').put( function(req, res) {
  Tutor.findById(req.params.tutor_id, (err, tutor) => {
    if (err) {
      res.send('err')
    }

    //update tutor info
    tutor.name = striptags(req.body.name);
    tutor.nickname = striptags(req.body.nickname);
    tutor.bio = striptags(req.body.bio);
    tutor.shortBio = striptags(req.body.shortBio);
    tutor.rate = Number(req.body.rate);
    tutor.education = striptags(req.body.education);
    tutor.location.zip = striptags(req.body.location.zip);
    tutor.location.serviceDistance = striptags(req.body.location.serviceDistance);
    tutor.contact.phone = striptags(req.body.contact.phone);
    tutor.contact.email = striptags(req.body.contact.email);
    tutor.schedule = striptags(req.body.schedule);

    // add subjects
    tutor.subjects = [];
    req.body.subjects.forEach((item)=>{
      tutor.subjects.push({
        subjectCategory: striptags(item.subjectCategory),
        classes: striptags(item.classes)
      });
    });

    console.log('Tutor');
    console.log(tutor);

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
        res.send('err')
      }
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
    });
  });
});

/* Delete Tutor */
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


module.exports = router;
