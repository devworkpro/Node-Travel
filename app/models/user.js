
      var BlogComment = require('./BlogComment');
       var blog = require('./blogPost');
   var Plan = require('./plan');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
// define the schema for our user model
var userSchema = mongoose.Schema({

 
        /* user_name: {
  type     : String,
  required : true
},
 first_name: {
  type     : String,
  required : true,
    message   : 'Please fill the last name'
},
 last_name: {
  type     : String,
  required : true,
    message   : 'Please fill the last name'
},

number: {
  type     : Number,
  required : true,
  unique   : true,
  validate : {
    validator : Number.isInteger,
    message   : '{VALUE} is not an integer value'
  }
} */
  local: {
    id : String,
        last_name: String,
        first_name: String,
        user_name: String,
        phone: String,
        email: String,
        password: String,
        role: String,
        status: Number,
        height: String,
        weight: String,
        waist: String,
        goal : String,
        age : String,
        fitness: String,
        from : String,
        photo: String,
        country: String,
        plan_id : String,
        resetPasswordToken : String,
        resetPasswordExpires: Date,
        created_at    : { type: Date },
        updated_at    : { type: Date },
        plan_at    : { type: Date },
      //  WOD_routine : String,
        last_login : { type: Date },
        PlanExpried_at    : { type: Date },
        PayComplete : String,
        code:String
    

        

        //{ type: Schema.Types.ObjectId, ref: 'plan' }
   },
     facebook: {
        id : String,
        last_name: String,
        first_name: String,
        user_name: String,
        phone: String,
        email: String,
        password: String,
        role: String,
        status: Number,
        height: String,
        weight: String,
        waist: String,
        age : String,
        fitness: String,
        goal : String,
        from : String,
        photo: String,
        country: String,
        plan_id : String,
        resetPasswordToken : String,
        resetPasswordExpires: Date,
         created_at    : { type: Date },
        updated_at    : { type: Date },
          plan_at    : { type: Date },
        //  WOD_routine : String,
        last_login : { type: Date },
          PlanExpried_at    : { type: Date },
           PayComplete : String,
            code:String
}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

