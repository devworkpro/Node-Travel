 var User = require('./user');
 require('./PostComment');
     require('./likes');


var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var postSchema = mongoose.Schema({
  
        userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
        message: String,
        title: String,
        image: String,
        video:String,
        created_at    : { type: Date },
        updated_at    : { type: Date },
        commentsIds: [{type:mongoose.Schema.ObjectId, ref:'PostComment'}],
        likes : [{type:mongoose.Schema.ObjectId, ref:'Like'}],
       disikes : [{type:mongoose.Schema.ObjectId, ref:'Like'}]

});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('post', postSchema);