// app/models/user.js
 var User = require('./user');
 
 
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema
// define the schema for our user model
var planSchema = mongoose.Schema({
      // _id : { type: Schema.Types.ObjectId, ref: 'User' },
        plan_name: String,
        //{ type: String, ref: 'user' }, 
        price: String,
        currency: String, 
        plan_duration: String 
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Plan', planSchema);