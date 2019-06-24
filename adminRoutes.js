var express = require('express');
var router = express.Router();
var path = require('path');
// Models
const Mailbot = require('./models/mailbot.js')();
const Purchase = require('./models/purchase');

const striptags = require('striptags');

const moment = require('moment');

// Models
const Blog = require('./models/blog');
const Tutor = require('./models/tutors');
// Secure random generator
const uuidv4 = require('uuid/v4');

/* GET tutors home. */
router.get('/tutors', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/admin/manageTutors.html'));
});

/*   - - - PURCHASES - - - GET - - -  */
router.get('/purchases', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/admin/purchases.html'));
});

/*   - - - PAYROLL - - - GET - - -  */
router.get('/payroll', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/admin/payroll.html'));
});

/*   - - - emailer - - - GET - - -  */
router.get('/emailer', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/admin/emailComposer.html'));
});

/*   - - - SUBJECT SETTINGS - - - GET - - -  */
router.get('/subjects', function(req, res, next) {
  console.log('request');
  res.sendFile(path.join(__dirname, '/views/admin/subjectSettings.html'));
});

/*   - - - BLOG HTML - - - GET - - -  */
router.get('/blog', function(req, res, next) {
  console.log('request');
  res.sendFile(path.join(__dirname, '/views/admin/blog.html'));
});

/*   - - - PURCHASES - - - GET - - -  */
router.get('/addpurchase', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/admin/addpurchase.html'));
});



/*   - - - BLOG HTML - - - GET - - -  */
router.get('/newblog', function(req, res, next) {
  console.log('request');
  res.sendFile(path.join(__dirname, '/views/admin/newBlog.html'));
});


/*   - - - Edit BLOG HTML - - - GET - - -  */
router.get('/editblog/:blogID', function(req, res, next) {
  console.log('request');

  res.sendFile(path.join(__dirname, '/views/admin/editBlog.html'));
});



// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
// Blog Content
// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
/*   - - - BLOG Array- - - GET - - -  */
router.get('/blog/list', function(req, res, next) {
  console.log('request');

  Blog.find({}).sort({creationDate:-1}).exec((err, blogs)=>{
    res.json(blogs);
  });
});

router.post('/blog/new', function(req, res) {
  console.log('new blog');

  console.log(req.body);
  // console.log('DATE');
  // console.log(req.body.creationDate);
  // console.log( Date(req.body.creationDate) );
  // console.log(typeof req.body.creationDate);

  var newPost = {
    // creationDate: Date.now(),
    creationDate: req.body.creationDate,
    author: {
      name: req.body.author.name,
      id: req.body.author.id,
      nickname: req.body.author.nickname
    },
    post_title: req.body.post_title,
    post_content: striptags(req.body.post_content)
  };

  Blog.create(newPost, (err, post) => {
    if (err) {
      console.log('-- Create new post error');
      console.log(err);
      res.json({message:"error"})
    }
    else {
      res.json({message:"success"})
    }
  })
});

router.post('/blog/edit', function(req, res) {
  console.log('new blog');
  console.log(req.body);

  Blog.findById(req.body.blogID).exec((err, blog) => {
    if (err) {
      res.send('err')
    }
    else {
      // set new fields
      blog.post_title = req.body.post_title;
      blog.post_content = striptags(req.body.post_content);
      blog.author.name = req.body.author.name;
      blog.author.nickname = req.body.author.nickname;
      blog.author.id = req.body.author.id;

      // save
      blog.save((err)=>{
        if (err) {
          console.log('edit blog post error');
          res.json({message:"error"});
        }
        else {
          res.json({message:"success"});
        }
      });
    }
  });
});

router.post('/blog/delete/:blogID', function(req, res) {
  console.log('new blog');
  console.log(req.params);

  Blog.remove({_id:req.params.blogID}, (err)=>{
    if (err) {
      console.log('Delete Blog error');
      res.json({message:"error"});
    }
    else {
      res.json({message:"success"});
    }
  })
});

// -------------------------
// Custom Purchase Submit
//
router.post('/customPurchaseSubmit', function(req, res) {
  req.body.date = Date.now();
  req.body.purchaseDate = moment().format('MMMM Do YYYY, h:mm a');
  // Save purchase to database
  Purchase.create(req.body, (err, purchase) => {
    if (err) {
      console.log('Create Custom Purchase error');
      res.json({message:"error"});
    }
    else {
      res.json({message:"success"});
    }
  });
});




// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -
// POST
// - - - - - - - - - - - - - -
// - - - - - - - - - - - - - -

// - - - - - - - - - - - - - -
/*   - - - * EMAILER * - - - - - -  */
// - - - - - - - - - - - - - -
router.post('/emailer', function(req, res) {
  console.log('EMAILER POST ---- #### -----');
  console.log(req.body);
  // emailAdminEmailer(add, subj, mess)

  console.log(req.body.emailAddress);
  console.log(req.body.subject);
  console.log(req.body.message);

  var emailInfo = req.body;

  var tutorQuery = {};

  // check for 'sent to' query
  if (emailInfo.emailAddress == 1) {
      console.log('ACTIVE TUTORS ONLY');
      tutorQuery = {activeTutor:true};
  }

  // Get list of all tutors.
  Tutor.find(tutorQuery).select({"contact":1}).exec((err, tutors) => {
    if (err) {
      res.send('err')
    }
    else {
      // res.json(tutors);

      // update email list
      // emailInfo.emailList = ["jwoodjack@gmail.com", "poppyPants@pooperville.com", "ypasner@gmail.com"];
      emailInfo.emailList = [];

      tutors.forEach((tutor)=>{
        // console.log(tutor.contact.email);

        if (tutor.contact.email) {
          // console.log(tutor.contact.email);
          emailInfo.emailList.push(tutor.contact.email);
        }

      });
      // console.log(emailInfo.emailList);

      // add admin to verify batch emails are working
      emailInfo.emailList.push("jwoodjack@gmail.com");

      // loop through and generate bundles of 50 with 1 minute cooldown.
      // how many emails to send in one batch
      const emailLimit = 50;
      // rounds up to the highest integer
      var batchCount = Math.ceil(emailInfo.emailList.length/emailLimit);
      // time in milliseconds to wait
      var emailTimeout = (3000*60);
      // function to send Mail in batches
      var emailMe = (batchEmailList)=>{
        var emailData = emailInfo;
        emailData.emailList = batchEmailList;

        Mailbot.emailerSend(emailData);

        // Testing
        // console.log('THIS IS THE LIST');
        // console.log(emailData);
        // console.log(emailData.emailList.length);
      };

      for (var i = 0; i < batchCount; i++) {
        var batchEmailList = emailInfo.emailList.splice(0,emailLimit);
        setTimeout(emailMe.bind(null, batchEmailList), emailTimeout*i);
      }




      // send emails
      // Mailbot.emailerSend(req.body);
      // Mailbot.emailerSend(emailInfo);

      // send success
      res.json({message:"success"});

    }
  });
});






module.exports = router;
