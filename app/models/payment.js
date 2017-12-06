// app/models/payment.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema
// define the schema for our user model
var paymentSchema = mongoose.Schema({
   
        userId: String,
        amount: String,
        currency: String, 
        duration: String,
        paymentId : String,
        packageId : String,
       created_at    : { type: Date },
        updated_at    : { type: Date }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Payment', paymentSchema);