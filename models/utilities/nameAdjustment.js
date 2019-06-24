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

      if (!tutor.firstName) {
          console.log(tutor.name);
          console.log(tutor.name.split(' ')[0]);
          tutor.firstName = tutor.name.split(' ')[0];


          if (!tutor.name.split(' ')[1]) {
            console.log(' * * * * * NO LAST NAME * * * * * ');
          }
          else {
            tutor.lastName = tutor.name.split(' ')[1];
            // console.log(tutor.name.split(' ')[1]);
          }
      }


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
