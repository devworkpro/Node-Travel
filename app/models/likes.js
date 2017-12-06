 var User = require('./user');
      var commentBlog = require('./BlogComment');
       var blog = require('./blogPost');


var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var likDisSchema = mongoose.Schema({
  
        userId: String,
        action: String,
        blogId: String,
         PostId: String,
        commentId: String,
        type:String,
        created_at    : { type: Date },
        updated_at    : { type: Date }

  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Like', likDisSchema);