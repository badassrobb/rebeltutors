// referencesRoutes.js

// Setup
var express = require('express');
var router = express.Router();
var path = require('path');
const striptags = require('striptags');
// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/badass');
// Models
const References = require('./models/references');
const Tutor = require('./models/tutors');


// Local functions
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

// Local Variables
// Subjects for Search and Adding Tutors
var subjectsList = ["Aerospace Engineering", "Agribusiness", "Agriculture", "Animal Science", "Anthropology", "Architectural Engineering", "Architecture", "Art", "Astronomy and Astrophysics", "Biology", "Biomedical Engineering", "Botany", "Business", "Chemistry", "Child Development", "City and Regional Planning", "Civil Engineering", "Communication Studies", "Computer Engineering", "Computer Science", "Criminal Justice", "Dairy Science", "Dance", "Data Science", "Earth Science", "Economics", "Education", "Electrical Engineering", "Engineering", "English", "Environmental Design", "Environmental Engineering", "Ethnic Studies", "Fire Protection Engineering", "Food Science and Nutrition", "Foreign Language", "Geography", "Geology", "Graphic Communication", "History", "Industrial and Manufacturing Engineering", "Industrial Technology and Packaging", "Journalism", "Kinesiology", "Landscape Architecture", "Liberal Arts", "Marine Science", "Materials Engineering", "Mathematics", "Mechanical Engineering", "Microbiology", "Military Science", "Music", "Natural Resources", "Other", "Philosophy", "Physical Science", "Physics", "Political Science", "Psychology", "Religious Studies", "Social Skills", "Sociology", "Soil Science", "Sports", "Statistics", "Test Prep", "Theatre", "Film", "Wine and Viticulture"];

var searchSubjectList = ["Algebra", "Calc", "Aerospace Engineering", "Agribusiness", "Agriculture", "Animal Science", "Anthropology", "Architectural Engineering", "Architecture", "Art", "Astronomy and Astrophysics", "Biology", "Biomedical Engineering", "Botany", "Business", "Chemistry", "Child Development", "City and Regional Planning", "Civil Engineering", "Communication Studies", "Computer Engineering", "Computer Science", "Dairy Science", "Dance", "Data Science", "Earth Science", "Economics", "Education", "Electrical Engineering", "Engineering", "English", "Environmental Design", "Environmental Engineering", "Ethnic Studies", "Fire Protection Engineering", "Food Science and Nutrition", "Foreign Language", "Geography", "Geology", "Graphic Communication", "History", "Industrial and Manufacturing Engineering", "Industrial Technology and Packaging", "Journalism", "Kinesiology", "Landscape Architecture", "Liberal Arts", "Marine Science", "Materials Engineering", "Mathematics", "Mechanical Engineering", "Microbiology", "Criminal Justice", "Military Science", "Music", "Natural Resources", "Other", "Philosophy", "Physical Science", "Physics", "Political Science", "Psychology", "Religious Studies", "Social Skills", "Sociology", "Soil Science", "Sports", "Statistics", "Test Prep", "Theatre", "Film", "Wine and Viticulture"];


module.exports = function (serverEnvironment) {

  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* GET Tutors */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/subjects').get( function(req, res) {
    res.json(subjectsList);
  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* GET SubjectList */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/subjectList').get( function(req, res) {
    // Find the subject list item
    References.findOne({name:"subjectList"}).select({}).exec((err, subjects) => {
      if (err) {
        res.send('err')
      }
      else {
        if (subjects) {
          console.log('Results');
          console.log(subjects);
          res.json(subjects.data);
        }
        else {
          res.json([]);
        }

      }
    });
  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* POST ADD SubjectList */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/subjectList/add:newTerm').post( function(req, res) {
    // Find the subject list item
    References.findOne({name:"subjectList"}).select({}).exec((err, subjects) => {
      if (err) {
        res.send('err')
      }
      else {
        if (!subjects) {
          var newData = [];
          newData.push(toTitleCase(req.params.newTerm));

          References.create({name:"subjectList", data:newData}, (err,item)=>{
            if (err) return handleError(err);
            // Saved!
            console.log('Saved');
          });
        }
        else {
          subjects.data.push(toTitleCase(req.params.newTerm));
          subjects.save((err)=>{
            if (err) return handleError(err);
            // saved!
            console.log('Done');
            // res.json('success');
          });
        }
        res.json('success');

      }
    });
  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* POST REMOVE SubjectList */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/subjectList/remove').post( function(req, res) {
    // Find the subject list item
    References.findOne({name:"subjectList"}).select({}).exec((err, subjects) => {
      if (err) {
        res.send('err')
      }
      else {
        if (subjects) {
          console.log('REMOVING');
          console.log(req.body);
          console.log('- - - - - - - ');
          console.log(subjects.data);



          if (req.body.remove) {
            var index = subjects.data.indexOf(req.body.remove);
          if (index !== -1) {
              subjects.data.splice(index, 1);
          }
          // subjects.data.splice(req.body.remove,1);
            console.log('- - - - - - - ');
            console.log(subjects.data);
            subjects.save((err)=>{
              if (err) return handleError(err);
              // saved!
              console.log('Done');
            });
          }
        }
        res.json('success');

      }
    });
  });
  // - - - - - - - -

  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* POST CONFIRM Subject */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/subjectList/confirm:newTerm').post( function(req, res) {
    // Find the subject list item
    References.findOne({name:"subjectList"}).select({}).exec((err, subjects) => {
      if (err) {
        res.send('err')
      }
      else {
        if (subjects) {
          console.log('CONFIRMING');
          console.log(req.params.newTerm);
          console.log('- - - - - - - ');
          console.log(subjects.searchTerms);



          if (req.params.newTerm) {
            if (!subjects.searchTerms) {
              subjects.searchTerms = [];
            }
            subjects.searchTerms.push(req.params.newTerm)
            console.log('- - - - - - - ');
            console.log(subjects.searchTerms);
            subjects.save((err)=>{
              if (err) return handleError(err);
              // saved!
              console.log('Done');
            });
          }
        }
        res.json('success');

      }
    });
  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* GET searchSubjectList */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/searchSubjectList').get( function(req, res) {
    // Find the subject list item
    res.json(searchSubjectList);
  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* GET tutorSubjects */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/tutorSubjects').get( function(req, res) {
    var subjectResults = [];

    Tutor.distinct('subjects.subjectCategory',{'subjects.subjectCategory':{$ne:""}}, (err, tutorResults) => {
      if (err) {
        console.log('Error getting tutorSubjects');
      }
      else {
        console.log('results');
        console.log('- - - - - ');
        console.log(tutorResults.length);
        console.log('- - - - - ');
        tutorResults.sort();

      }
      // console.log('Subjects * * * * * ');
      // console.log(subjectResults);

      res.json(tutorResults);
    });

  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* GET fullSubjectList */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/fullSubjectList').get( function(req, res) {
    var subjectResults = [];

    Tutor.distinct('subjects.subjectCategory',{'subjects.subjectCategory':{$ne:""}}, (err, tutorResults) => {
      if (err) {
        console.log('Error getting tutorSubjects');
      }
      else {


        References.findOne({name:"subjectList"}).select({}).exec((err, subjects) => {
          if (err) {
            res.send('err')
          }
          else {
            if (subjects) {
              console.log(tutorResults.length);

              tutorResults.forEach((tutorItem)=>{
                var termAdded = false;
                // check to see if it is a confirmed subject
                if (subjects.searchTerms) {
                  subjects.searchTerms.forEach((confirmedTerm)=>{

                    if (!termAdded && confirmedTerm === tutorItem) {
                        subjectResults.push({type:"tutorSubject", name:tutorItem, confirmed: true});
                        termAdded = true;
                    }
                  });
                }
                if (!termAdded){
                  subjectResults.push({type:"tutorSubject", name:tutorItem, confirmed: false});
                  termAdded = true;
                }
                // subjectResults.push({type:"tutorSubject", name:tutorItem});
              });

              subjects.data.forEach((searchItem)=>{
                subjectResults.push({type:"searchTerm", name:searchItem, confirmed:true});
              });
            }
            // send back sorted information

            console.log('RESULTS');
            // console.log(tutorResults);
            res.json(subjectResults);
          }
        });


      }
      // console.log('Subjects * * * * * ');
      // console.log(subjectResults);
    });
  });
  // - - - - - - - -


  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  /* GET fullSubjectListAutofill */
  // - - - - - - - -
  // - - - - - - - -
  // - - - - - - - -
  router.route('/fullSubjectListAutofill').get( function(req, res) {
    var subjectResults = [];

    References.findOne({name:"subjectList"}).select({}).exec((err, subjects) => {
      if (err) {
        res.send('err')
      }
      else {
        if (subjects) {
          // check for admin added terms
          if (subjects.data) {
            console.log(subjects.data.length);
            subjectResults = subjectResults.concat(subjects.data);
          }
          // check for confirmed tutor words
          if (subjects.searchTerms) {
            console.log(subjects.searchTerms.length);
            subjectResults = subjectResults.concat(subjects.searchTerms);
          }
        }
        // send back sorted information

        console.log('RESULTS');
        console.log(subjectResults.length);
        subjectResults.sort();
        res.json(subjectResults);
      }
    });

  });
  // - - - - - - - -








  return router;

};
