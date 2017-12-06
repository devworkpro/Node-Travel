var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var trainerinfoSchema = mongoose.Schema({
  
        trainer_name: String,
        trainer_facebook:String,
        trainer_twiter:String,
        trainer_google: String,
         trainer_profile: String,
         trainig_type:String
        
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('trainerinfo', trainerinfoSchema);