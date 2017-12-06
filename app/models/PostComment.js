    var User = require('./user');
     var likes = require('./likes');
          var post = require('./post');
           var PostComment = require('./PostComment');
var notification = require('./notification');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var PostCommentSchema = mongoose.Schema({
  
        userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
        message: String,
        postId: {type:mongoose.Schema.ObjectId, ref:'post'},
        image: String,
        commtId : String,
        type: String,
        order:String,
        parentId : String,
        created_at    : { type: Date },
        updated_at    : { type: Date }

  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('PostComment', PostCommentSchema);