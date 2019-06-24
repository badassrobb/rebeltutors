// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt   = require('bcrypt-nodejs');

// create a schema
var tutorSchema = new Schema({
  applyNotificaiton: Boolean,
  activeTutor: Boolean,
  onlineTutor: Boolean,
  firstName: String,
  lastName: String,
  name: String,
  nickname: String,
  contact: {
    phone: String,
    email: String
  },
  bio: String,
  shortBio: String,
  rate: Number,
  payRate: Number,
  // subjects: Array,
  subjects: [{
    subjectCategory: String,
    classes: String
  }],
  profileVideo: String,
  education: String,
  location: {
    serviceDistance: Number
  },
  geoCoded:{
    formatted_address : String,
    url : String,
    vicinity: String,
    name: String,
    address_components: Array,
    geo: Object
  },
  schedule: String,
  photo: String,
  comments: String,
  partyHost: Boolean,
  local : {
    email : String,
    password : String,
  }
});

// methods ======================
// generating a hash
tutorSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
tutorSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// the schema is useless so far
// we need to create a model using it
var Tutor = mongoose.model('Tutor', tutorSchema);

// make this available to our users in our Node applications
module.exports = Tutor;
