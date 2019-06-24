var express = require('express');
var router = express.Router();
var path = require('path');
// const moment = require('moment');

// Database
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/badass');
// Models
// const Purchase = require('./models/purchase');
// const Tutor = require('./models/tutors');
// Mailbot
// const Mailbot = require('./models/mailbot.js')();


module.exports = function (serverEnvironment) {





  /* GET home page. */
  router.get('/', function(req, res, next) {
    console.log('SUBJECT HOME');
    res.sendFile(path.join(__dirname, '/views/subjects/subjects.html'));
  });

  // - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - -
  // ALL THE SUBJECTS ROUTED
  router.get('/test-prep', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/test-prep.html'));
  });

  router.get('/anthropology', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/anthropology.html'));
  });

  router.get('/art', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/art.html'));
  });

  router.get('/astronomy-and-astrophysics', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/astronomy-and-astrophysics.html'));
  });

  router.get('/biology', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/biology.html'));
  });

  router.get('/business', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/business.html'));
  });

  router.get('/chemistry', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/chemistry.html'));
  });

  router.get('/civil-engineering', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/civil-engineering.html'));
  });

  router.get('/communication-studies', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/communication-studies.html'));
  });

  router.get('/computer-science', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/computer-science.html'));
  });

  router.get('/electrical-engineering', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/electrical-engineering.html'));
  });

  router.get('/english', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/english.html'));
  });

  router.get('/food-science-and-nutrition', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/food-science-and-nutrition.html'));
  });

  router.get('/history', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/history.html'));
  });

  router.get('/materials-engineering', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/materials-engineering.html'));
  });

  router.get('/mathematics', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/mathematics.html'));
  });

  router.get('/mechanical-engineering', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/mechanical-engineering.html'));
  });

  router.get('/mathematics', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/mathematics.html'));
  });

  router.get('/materials-engineering', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/materials-engineering.html'));
  });

  router.get('/philosophy', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/philosophy.html'));
  });

  router.get('/physics', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/physics.html'));
  });

  router.get('/psychology', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/psychology.html'));
  });

  router.get('/spanish', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/spanish.html'));
  });

  router.get('/sports', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/sports.html'));
  });

  router.get('/statistics', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/statistics.html'));
  });

  router.get('/world-languages-and-cultures', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/subjects/world-languages-and-cultures.html'));
  });






    return router;
};



// module.exports = router(serverEnvironment);
