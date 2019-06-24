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

  const col = db.collection('blog');

  //
  // Get first two documents that match the query
  col.find({post_parent:"0"}).toArray(function(err, docs) {
    assert.equal(null, err);

    console.log('Found documents');
    console.log(docs.length);
    docs.forEach((item, index)=>{
      // console.log(item.post_content);
    });
    col.distinct('post_parent', (err, result)=>{
      // console.log('');
      assert.equal(null, err);
      console.log(result);
      console.log(result.length);
    });
    client.close();
  });



});
