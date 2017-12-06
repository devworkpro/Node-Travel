// app/models/user.js
// load the things we need
//require('./wodRecord');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var homeimageSchema = mongoose.Schema({
  
        title: String,
        home_img: String
        
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('homeimage', homeimageSchema);