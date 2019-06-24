// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var purhcaseSchema = new Schema({
  total: Number,
  assignMe: Boolean,
  cart: Array,
  date: Date,
  purchaseDate: String,
  formData: {
    firstName: String,
    lastName: String,
    school: String,
    email: String,
    phone: String,
    goals: String,
  },
  braintree: Array,
  deleted: Boolean,
  paypal: Array,
  square: Array,
  purchaseNote: String,
  purchaseType: String,
  purchaseComplete: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Purchase = mongoose.model('Purchase', purhcaseSchema);

// make this available to our users in our Node applications
module.exports = Purchase;
