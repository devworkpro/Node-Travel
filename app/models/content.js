// app/models/user.js
 //var User = require('./user');
 
  
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema
// define the schema for our user model
var contentSchema = mongoose.Schema({
      // _id : { type: Schema.Types.ObjectId, ref: 'User' },
        content_heading: String,
        //{ type: String, ref: 'user' }, 
        
        content_desc: String 
});

// create the model for users and expose it to our app
module.exports = mongoose.model('content', contentSchema);