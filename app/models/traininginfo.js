var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var traininginfoSchema = mongoose.Schema({
  
        trainer_title: String,
        
         training_profile: String
         
        
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('traininginfo', traininginfoSchema);