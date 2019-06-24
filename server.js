// server.js



// environment
// - - - - - - - - - - -
//
// const serverEnvironment = "local_sandbox";

// const serverEnvironment = "aws_sandbox";

const serverEnvironment = "production";


var adminRoutesAddress = null;

if (serverEnvironment == "local_sandbox") {
  console.log(' - - - - - - - - - - - - - - - - ');
  console.log('  ** LOCAL * SANDBOX  **  Environment');
  console.log(' - - - - - - - - - - - - - - - - ');
  adminRoutesAddress = '/admin';
}
else if (serverEnvironment == "aws_sandbox"){
  console.log(' - - - - - - - - - - - - - - - - ');
  console.log('  ** AWS * SANDBOX **  Environment');
  console.log(' - - - - - - - - - - - - - - - - ');
  adminRoutesAddress = '/roYZs3geY8nEIXFytL2q85t8qcYatQMPM1WlyoCiuecmIhcwJB9QMZXsPaPcKhIxCQPmRC0T6BsWtsUIEsPo3VVmQK6e276MM2n9';
}
else if (serverEnvironment == "production"){
  console.log(' - - - - - - - - - - - - - - - - ');
  console.log('  ** PRODUCTION **  Environment');
  console.log(' - - - - - - - - - - - - - - - - ');
  adminRoutesAddress = '/roYZs3geY8nEIXFytL2q85t8qcYatQMPM1WlyoCiuecmIhcwJB9QMZXsPaPcKhIxCQPmRC0T6BsWtsUIEsPo3VVmQK6e276MM2n9';
}

// Setup
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

// Passport
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
var passport = require('passport');
var session  = require('express-session');
require('./models/passport')(passport); // pass passport for configuration
app.use(session({ secret: 'badassTutorLovesthescotch19473095' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// KEEN logger
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
// if (serverEnvironment == "production") {
//   console.log(' -- KEEN LOGGER * ACTIVATED *');
//   var KeenTracking = require('keen-tracking');
//   var keenClient = new KeenTracking({
//       projectId: '5abe5d96c9e77c0001b464d7',
//       writeKey: 'CEECD7D29DAA818F0708FCA8AF26955E0E5553708443A4BB56E362B8A31C9C2328037256CC8A8BEBC346AA1FAE0135CB8D5CF872127F183FA21E94924C6D8C2792E894332E32F19CED44E111D83AD09AEF7357B92D4F53F40DF52D343F1FAD94'
//   });
// }

//  SENTRY
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
// if (serverEnvironment == "production" || serverEnvironment == "aws_sandbox") {
if (true){
  // Raven - Sentry error tracking
  console.log(' -- SENTRY RAVEN * ACTIVATED *');
  var Raven = require('raven');
  app.use(logger('dev'));
  Raven.config('https://c8eeb7c24bdd4903905d3e41f1e5c6e2:f378577f9f1745588ad4e2a7b3a1f079@sentry.io/304594').install();
}
else {
    app.use(logger('dev'));
}



// Routes
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
var indexRoutes = require('./routes')(serverEnvironment, Raven);
var apiRoutes = require('./apiRoutes.js')(serverEnvironment);
var adminRoutes = require('./adminRoutes.js');
var referencesRoutes = require('./referencesRoutes.js')(serverEnvironment);
var subjectRoutes = require('./subjectRoutes.js')(serverEnvironment);
var purchaseRoutes = require('./purchaseRoutes.js')(serverEnvironment);
var tutorRoutes = require('./tutorRoutes.js')(passport, serverEnvironment);
var schoolRoutes = require('./schoolRoutes.js')();
var blogRoutes = require('./blogRoutes.js');


//  Set helmet for protection
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
app.use(helmet());





// Configure Server Options
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '5mb' }));                                     // parse application/json

// Static Files
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
app.use('/public/', express.static(path.join(__dirname, 'public')));


//Middleware to log routing
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
// if (serverEnvironment == "production") {
//   app.use(function (req, res, next) {
//     // console.log('----ROUTING---');
//     // console.log(req.originalUrl);
//     // console.log('Time:', Date.now());
//     // keen record
//     keenClient.recordEvent('requests', {
//     data: {
//         page: req.originalUrl,
//         url: req.hostname,
//         env: serverEnvironment
//         }
//     });
//     next();
//   });
// }


//Primary Route
// - - - - - - - - - - - - - - - - -
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use(adminRoutesAddress, adminRoutes);
app.use('/references', referencesRoutes);
app.use('/subjects', subjectRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/tutor', tutorRoutes);
app.use('/schools', schoolRoutes);
app.use('/blog', blogRoutes);


// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - -
// catch 404 and forward to error handler
// - - - - - - - - - - - - - - - - -
app.use(function(req, res, next) {
  // res.sendStatus(404);

  // respond with html page
  if (req.accepts('html')) {
    res.redirect('/404')
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');

});

// Listen on port 8000
// - - - - - - - - - - - - - - - - -
if (serverEnvironment == "production") {
  app.listen(8000);
  console.log(' -- PRODUCTION - LIVE @ PORT  8000');
}
else if (serverEnvironment == "aws_sandbox") {
  app.listen(80);
  console.log(' -- AWS SANDBOX - LIVE @ PORT  80');
}
else if (serverEnvironment == "local_sandbox"){
  app.listen(8000);
  console.log(' -- local_sandbox @ PORT  8000');
}
