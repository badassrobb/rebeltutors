// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Tutor = require('../tutors');
const Mailbot = require('../mailbot.js')();
// Secure random generator
const uuidv4 = require('uuid/v4');


// Tutor.find({'contact.email':"ypasner@gmail.com"}, (err, tutor) => {
Tutor.find({}, (err, tutor) => {
  if (err) {
    console.log('ERROR -----');
  }
  else {
    console.log('SUCCESS ------');

    if (tutor) {
      tutor.forEach((tutorInfo, tutorIndex)=>{
        tutor[tutorIndex].local.email = tutorInfo.contact.email;
        var newPass =  uuidv4().slice(9,18);
        tutor[tutorIndex].local.password = tutor[tutorIndex].generateHash(newPass);
        // Send email
        tutor[tutorIndex].save((err) => {
          if (err) {
            console.log('ERROR TUTOR SAVE: ');
          }
          else {
            console.log('SAVE SUCCESSFUL');
            console.log(tutor[tutorIndex].local.email);
            // EMAIL CUSTOMER
            // _ _ _ _ _ _ _ _
            Mailbot.emailWelcome(tutor[tutorIndex].local.email, newPass);
          }
        });
        // end email send
      });
    }
  }
});
