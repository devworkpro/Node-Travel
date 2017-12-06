var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var trainercontentSchema = mongoose.Schema({
        heading: String,
         desc: String
});

// methods ======================


// create the model for users and expose it to our app
module.exports = mongoose.model('trainercontent', trainercontentSchema);