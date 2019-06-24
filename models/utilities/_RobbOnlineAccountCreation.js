// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Tutor = require('../tutors');

Tutor.find({'contact.email':"bigcheese@badasstutors.com"}, (err, tutor) => {
  if (err) {
    console.log('ERROR -----');
  }
  else {
    console.log('SUCCESS ------');
    console.log(tutor[0].name);

    tutor[0].local.email = "bigcheese@badasstutors.com"
    tutor[0].local.password = tutor[0].generateHash('Fuckyou17!');

    tutor[0].save((err) => {
      if (err) {
        console.log('ERROR TUTOR SAVE: ');
      }
      else {
        console.log('SAVE SUCCESSFUL');
      }
    });
  }
});
