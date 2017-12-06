// app/models/user.js
// load the things we need
 require('./WOD');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



// define the schema for our user model
var WODSchema = mongoose.Schema({
  
        WOD_Id: {type:mongoose.Schema.ObjectId, ref:'WOD'},
        time: String,
        userId: String,
        total :String,
        created_at    : { type: Date },
        updated_at    : { type: Date }

  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('wodRecord', WODSchema);