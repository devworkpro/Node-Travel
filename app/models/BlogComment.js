    var User = require('./user');
     var likes = require('./likes');
          var blog = require('./blogPost');
           var BlogComment = require('./BlogComment');
var notification = require('./notification');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var blogCommentSchema = mongoose.Schema({
  
        userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
        message: String,
        blogId: {type:mongoose.Schema.ObjectId, ref:'blog'},
        image: String,
        commtId : {type:mongoose.Schema.ObjectId, ref:'BlogComment'},
        type: String,
        order:String,
        parentId : String,
        created_at    : { type: Date },
        updated_at    : { type: Date }


  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('BlogComment', blogCommentSchema);