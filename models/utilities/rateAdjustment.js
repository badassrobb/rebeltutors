// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Tutor = require('../tutors');

Tutor.find((err, tutors) => {
  if (err) {
    console.log('ERROR -----');
  }
  else {
    console.log('SUCCESS ------');

    tutors.forEach((tutor, tutorIndex)=>{
      console.log('--------');
      console.log(tutor.nickname);
      console.log(tutor.rate);

      // tutor.rate =
      tutor.payRate = (tutor.rate-5)/2;

      console.log(tutor.rate);
      console.log('--------');

      tutor.save((err) => {
        if (err) {
          console.log('ERROR TUTOR SAVE: ');
        }
        else {
          console.log('SAVE SUCCESSFUL');
        }
      });

    });
  }
});
