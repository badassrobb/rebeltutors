// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const Blog = require('../blog');

Blog.find((err, blogs) => {
  if (err) {
    console.log('ERROR -----');
  }
  else {
    console.log('SUCCESS ------');

    blogs.forEach((blog)=>{
      console.log('--------');
      console.log( new Date(blog.creationDate).toISOString() );

      blog.c_Date = new Date(blog.creationDate);



      blog.save((err) => {
        if (err) {
          console.log('ERROR BLOG SAVE: ');
        }
        else {
          console.log('SAVE SUCCESSFUL');
        }
      });

    });
  }
});
