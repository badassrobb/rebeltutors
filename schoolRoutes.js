var express = require('express');
var router = express.Router();
var path = require('path');


module.exports = function () {



  // - - - - - - - - - - - -
  // SCHOOLS
  // - - - - - - - - - - - -

  /* GET Cal Poly page. */

  router.get('/calpoly-pomona', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/calpoly-pomona.html'));
  });

  router.get('/calpoly', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/calpoly.html'));
  });


  // CSU
  router.get('/csub', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csub.html'));
  });

  router.get('/csuc', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csuc.html'));
  });

  router.get('/csuci', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csuci.html'));
  });

  router.get('/csudh', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csudh.html'));
  });

  router.get('/csueb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csueb.html'));
  });

  router.get('/csufresno', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csufresno.html'));
  });

  router.get('/csufullerton', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csufullerton.html'));
  });

  router.get('/csula', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csula.html'));
  });

  router.get('/csulb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csulb.html'));
  });

  router.get('/csumb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csumb.html'));
  });

  router.get('/csun', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csun.html'));
  });

  router.get('/csus', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csus.html'));
  });

  router.get('/csusb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csusb.html'));
  });

  router.get('/csusm', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/csusm.html'));
  });

  router.get('/hsu', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/hsu.html'));
  });

  router.get('/sbcc', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/sbcc.html'));
  });

  router.get('/sdsu', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/sdsu.html'));
  });

  router.get('/sfsu', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/sfsu.html'));
  });

  router.get('/ssu', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ssu.html'));
  });

  router.get('/stanislausState', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/stanislausState.html'));
  });

  // UC

  router.get('/ucb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucb.html'));
  });

  router.get('/ucd', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucd.html'));
  });

  router.get('/uci', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/uci.html'));
  });

  router.get('/ucla', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucla.html'));
  });

  router.get('/ucm', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucm.html'));
  });

  router.get('/ucr', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucr.html'));
  });

  router.get('/ucsb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucsb.html'));
  });

  router.get('/ucsc', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucsc.html'));
  });

  router.get('/ucsd', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucsd.html'));
  });

  router.get('/ucsf', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/schools/ucsf.html'));
  });










    return router;
};



// module.exports = router(serverEnvironment);
