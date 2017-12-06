// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var contactSchema = mongoose.Schema({
        senderName : String,
        senderEmail : String,
        reciver :String,
        subject :String,
        message :String
});

// methods ======================


// create the model for users and expose it to our app
module.exports = mongoose.model('Contact', contactSchema);