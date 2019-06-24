// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var queryStats = new Schema({
  date: Date,
  eventName: String,
  query: Object
});

// the schema is useless so far
// we need to create a model using it
var SearchStats = mongoose.model('SearchStats', queryStats);

// make this available to our users in our Node applications
module.exports = SearchStats;
