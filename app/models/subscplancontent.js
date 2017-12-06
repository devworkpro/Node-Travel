var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var subscplancontentSchema = mongoose.Schema({
  
        content_desc: String,
        title: String,
     
         
        
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('subscplancontent', subscplancontentSchema);