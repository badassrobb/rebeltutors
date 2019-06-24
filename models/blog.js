// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var blogSchema = new Schema({
  creationDate: String,
  c_Date: Date,
  author: {
    name: String,
    id: String,
    nickname: String
  },
  comments: Array,
  post_title: String,
  post_content: String,
  tags: Array
});

// the schema is useless so far
// we need to create a model using it
var Blog = mongoose.model('Blog', blogSchema);

// make this available to our users in our Node applications
module.exports = Blog;
