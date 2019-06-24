// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var references = new Schema({
  name: String,
  data: Array,
  searchTerms: Array
});


// the schema is useless so far
// we need to create a model using it
var referenceCollection = mongoose.model('referenceCollection', references);

// make this available to our users in our Node applications
module.exports = referenceCollection;
