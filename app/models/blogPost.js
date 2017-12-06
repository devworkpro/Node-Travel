 var User = require('./user');
 require('./BlogComment');
     require('./likes');


var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var blogSchema = mongoose.Schema({
  
        userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
        message: String,
        title: String,
        image: String,
        tags : String,
        created_at    : { type: Date },
        updated_at    : { type: Date },
        commentsIds: [{type:mongoose.Schema.ObjectId, ref:'BlogComment'}],
        likes : [{type:mongoose.Schema.ObjectId, ref:'Like'}]
  
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('blogPost', blogSchema);