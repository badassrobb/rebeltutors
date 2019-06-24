var express = require('express');
var router = express.Router();
var path = require('path');

// Models
const Blog = require('./models/blog');


/*   - - - BLOG HTML - - - GET - - -  */
router.get('/', function(req, res, next) {
  console.log('request');
  res.sendFile(path.join(__dirname, '/views/blogs.html'));
});


/*   - - - Detail Blog  */
router.get('/detail/:blog_ID', function(req, res, next) {
  console.log('request detailed blog');

  console.log( req.params.blog_ID );

  res.sendFile(path.join(__dirname, '/views/blog-detailed.html'));

});





// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
// Blog Content - API
// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
/*   - - - BLOG Array- - - GET - - -  */
router.get('/list', function(req, res, next) {
  console.log('request');

  Blog.find({}).sort({c_Date:-1}).exec((err, blogs)=>{
    res.json(blogs);
  });
});

/*   - - - BLOG By ID- - - GET - - -  */
router.get('/find/:blogID', function(req, res, next) {
  console.log('request');
  console.log(req.params.blogID);

  Blog.findById(req.params.blogID).exec((err, blog)=>{
    if (err) {

    }
    else {
      console.log('Found Blog');
      res.json(blog);
    }

  });
});





module.exports = router;
