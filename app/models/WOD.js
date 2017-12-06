// app/models/user.js
// load the things we need
require('./wodRecord');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var videoSchema = mongoose.Schema({
  
        video_title: String,
        video_des: String,
        video_link: String,
        video_img: String,
        WOD_plan: String,
        order : String
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('WOD', videoSchema);