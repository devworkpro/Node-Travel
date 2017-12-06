// app/models/user.js
 var User = require('./user');
 
 
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema
// define the schema for our user model
var chatSchema = mongoose.Schema({
      // _id : { type: Schema.Types.ObjectId, ref: 'User' },
        reciever: String,
        //{ type: String, ref: 'user' }, 
        sender:String,
        msg_desc: String,
        username: String,
        userid:String,
        role:String,
        created_at    : { type: Date }
       
});

// create the model for users and expose it to our app
module.exports = mongoose.model('chat', chatSchema);