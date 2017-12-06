// app/models/user.js
 var User = require('./user');
     var likes = require('./likes');
          var blog = require('./blogPost');
           var BlogComment = require('./BlogComment');
        var post = require('./post');

 
 
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema
// define the schema for our user model
var notificationSchema = mongoose.Schema({
      
        blogId: {type:mongoose.Schema.ObjectId, ref:'blogPost'},
      PostId: {type:mongoose.Schema.ObjectId, ref:'post'},

        userId: {type:mongoose.Schema.ObjectId, ref:'User'},
        type: String, 
        commentId: {type:mongoose.Schema.ObjectId, ref:'BlogComment'},
         likeId: String,
         created_at    : { type: Date },
        updated_at    : { type: Date },
        status : [{type:mongoose.Schema.ObjectId, ref:'User'}],
        UserRecord : [{type:mongoose.Schema.ObjectId, ref:'User'}],
        read:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('notification', notificationSchema);