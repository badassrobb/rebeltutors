function create2dSphereIndex(db, callback) {
  // Get the restaurants collection
  const collection = db.collection('tutors');
  // Create the index
  collection.createIndex(
    { 'geoCoded.geo.location.coordinates' : "2dsphere" }, function(err, result) {
    console.log(result);
    callback(result);
  });
};


var createFirstNameDescendingIndex = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('tutors');
  // Create the index
  collection.createIndex(
    { firstName : -1 }, function(err, result) {
    console.log(result);
    callback(result);
  });
};



// Geo search
// - - - - - - - - - - -
// Find some documents
// - - - - - - - - - - -
function findLocations(db, callback){
  // Get the documents collection
  var collection = db.collection('tutors');
  collection.find(
  { 'geoCoded.geo.location.coordinates':
    { $near :
      { $geometry:
        { type: "Point",  coordinates: [ -120.6707, 35.4894 ] },
          $maxDistance: 12000
      }
    }
  }
  ).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback();
  });
}


// - - - - - - - - - - -
// Mongo lib
// - - - - - - - - - - -
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'badass';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);



  // - - - - - - - - - - -
  // Create index !!!!!!
  // - - - - - - - - - - -
  // *********************

  create2dSphereIndex(db, function() {
      client.close();
      console.log(' ');
      console.log(' Created 2DSphere Index');
      console.log(' ');
      console.log(' -- COMPLETE --');
      console.log(' ');

  });

  createFirstNameDescendingIndex(db, function() {
      client.close();
      console.log(' ');
      console.log(' Created First Name Index');
      console.log(' ');
      console.log(' -- COMPLETE --');
      console.log(' ');

  });

  // *********************
  // - - - - - - - - - - -
  // - - - - - - - - - - -



});
