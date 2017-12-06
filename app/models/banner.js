var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var bannerSchema = mongoose.Schema({
  
        banner_heading: String,
        banner_subheading:String,
        banner_image:String
        
        
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('banner', bannerSchema);