var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');
 var Plan = require('../app/models/plan');
 var path = require('path')
var configAuth = require('./auth');
var request = require("request").defaults({ encoding: null });
var fs = require('fs');
var mv = require('mv');
  var notification = require('../app/models/notification');
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
 passport.use('local-signup', new LocalStrategy({
            usernameField: 'user_name',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
  
            var user_name = req.body.user_name;
            var first_name = req.body.first_name;
            var last_name = req.body.last_name;
           var phone = '';
            var email = req.body.email;
            var password = req.body.password;
            var package = req.body.package;
            var role = req.body.role;
            var status = '1';
            var height = '';
            var weight = '';
             var goal = '';
            var waist = '';
            var fitness = '';
            var age = '';
            var country = '';
         // var WOD_routine = '';
            var photo = '';

            process.nextTick(function() {
                User.findOne({ 
                 $or: [{'local.email': email},{'local.user_name': user_name},{'facebook.user_name': user_name},{'facebook.email': email}]
                }, function(err, user) {

                    if (err) return done(err);

                    if (user)
                        return done(null, false, req.flash('signupMessage', 'The User name or email already exists'));
                    else {

      Plan.findOne({'_id':package}).exec( function(err, plan) {
if(plan.plan_duration == '1 Week'){
var firstDay = new Date();
           var expriedDate =  new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
}else if(plan.plan_duration == '3 Month'){
 
var x = 3;

var expriedDate = new Date();
expriedDate.setMonth(expriedDate.getMonth() + x);
}else if(plan.plan_duration == '6 Month'){
    var x = 6;

var expriedDate = new Date();
expriedDate.setMonth(expriedDate.getMonth() + x);
}

                        var newUser = new User();
                        newUser.local.user_name = user_name;
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.first_name = first_name;
                        newUser.local.last_name = last_name;
                        newUser.local.phone = phone;
                        newUser.local.plan_id = package;
                        newUser.local.role = role;
                        newUser.local.status = status;
                        newUser.local.height = height;
                        newUser.local.weight = weight;
                        newUser.local.waist = waist;
                        newUser.local.fitness = fitness;
                        newUser.local.photo = photo;
                         newUser.local.goal = goal;
                           newUser.local.goal = goal;
                            newUser.local.last_login = '';
                            newUser.local.PayComplete = '';
                            
                        
                        newUser.local.country = country;
                        newUser.local.from = 'local';
                         newUser.local.age = age;
                           newUser.local.PlanExpried_at = expriedDate;
                       //   newUser.local.WOD_routine = WOD_routine;
                         
                        
                           newUser.local.created_at = new Date();
                  newUser.local.updated_at = new Date();
                   newUser.local.plan_at = new Date();
                              
                        newUser.save(function(err) {
                            if (err) throw done(err);
                           
 User.findOne({'local.role':'admin'}).exec( function (err,admin){
var adj = [];
  adj.push(admin.id);

                     var notificatn = new notification();
    var adj1=[];
    adj1.push(newUser.id);
                    notificatn.userId = newUser.id;
                    notificatn.type = 'signUp';
                     notificatn.created_at = new Date();
                    notificatn.updated_at = new Date();
                     notificatn.status = adj;
                      notificatn.UserRecord = adj;
                      
                      notificatn.read = adj1;

                    
                   console.log(notificatn);

                 notificatn.save(function(err, res) {
                     if (err) {

                   // res.send('err');
                    } else {


                    }
                });
});




                            req.session.logUser = newUser.id;
                            req.session.planTaken = package;                          

                            return done(null, newUser);
                        });
                    
                         });
                    }

                });
            });
        }));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'user_name',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {

        process.nextTick(function() {
            User.findOne({
                'local.user_name': email
            }, function(err, user) {
                console.log(user);
                if (err) return done(err);
                if (!user) {
                    // console.log(req.flash);
                    return done(null, false, req.flash('loginMessage', 'User does not exist'));
                }

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Password is not correct'));
                }



                return done(null, user);
            });
        });
    }));



    /*********local remember me functionality*****/

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'name', 'gender','email', 'picture.type(large)'],
            enableProof: true
        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {

               
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {

  if(profile.photos[0].value){
var uri =profile.photos[0].value;
var type;
var download = function(uri, filename, profile,callback){
  request.head(uri, function(err, res, body){
    if(res.headers['content-type'] == 'image/jpeg' || res.headers['content-type'] == 'image/jpg'){
    
type = 'jpg';
}else if(res.headers['content-type'] == 'image/png'){
type = 'png';
}
filename = filename +'.'+ type;
    request(uri).pipe(fs.createWriteStream(filename)).on('close', function() {
var des = path.join(__dirname, '../public/uploads/images/'+ filename);  

mv(filename, des, function(err) {
});

   var newUser = new User();
 newUser.facebook.photo = filename;
     newUser.facebook.id = profile.id; // set the users facebook id  
                        newUser.facebook.user_name = profile.displayName;
                        
                        //  newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        //  newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.country = '';
                        newUser.facebook.phone = '';
                        newUser.facebook.created_at = new Date();
                        newUser.facebook.updated_at = new Date();
                        newUser.facebook.role = 'user';
                        newUser.facebook.status = '1';
                        newUser.facebook.height = '';
                        newUser.facebook.weight = '';
                        newUser.facebook.waist = '';
                        newUser.facebook.fitness = '';
                         newUser.facebook.plan_id = '';
                         newUser.facebook.goal = '';
                         newUser.facebook.age = '';
                          newUser.facebook.PayComplete = '';
                          newUser.facebook.last_login = '';
                        // newUser.facebook.WOD_routine = '';
                     
                         newUser.facebook.from = 'facebook';
                          newUser.facebook.first_name = profile._json.first_name;
                           newUser.facebook.last_name = profile._json.last_name

                        // save our user to the database
                        newUser.save( function(err) {
                            if (err)
                                throw err;

                            User.findOne({'local.role':'admin'}).exec( function (err,admin){
var adj = [];
  adj.push(admin.id);

                     var notificatn = new notification();
    
                    notificatn.userId = newUser.id;
                    notificatn.type = 'signUp';
                     notificatn.created_at = new Date();
                    notificatn.updated_at = new Date();
                     notificatn.status = adj;
                      notificatn.UserRecord = adj;
                    
                   console.log(notificatn);

                 notificatn.save(function(err, res) {
                     if (err) {

                   // res.send('err');
                    } else {


                    }
                });
});


                            // if successful, return the new user
                            return done(null, newUser);
                        });
});
});
}
var nm = new Date() + '_' +'facebook';

download(uri, nm, profile, function(){
});




}else{
     var newUser = new User();
    newUser.facebook.photo = '';
     newUser.facebook.id = profile.id; // set the users facebook id  
                        newUser.facebook.user_name = profile.displayName;
                        
                        //  newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        //  newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.country = '';
                        newUser.facebook.phone = '';
                        newUser.facebook.created_at = new Date();
                        newUser.facebook.updated_at = new Date();
                        newUser.facebook.role = 'user';
                        newUser.facebook.status = '1';
                        newUser.facebook.height = '';
                        newUser.facebook.weight = '';
                        newUser.facebook.goal = '';
                        newUser.facebook.waist = '';
                         newUser.facebook.plan_id = '';
                        newUser.facebook.fitness = '';
                         newUser.facebook.PayComplete = '';
                        newUser.facebook.age = '';
                        // newUser.facebook.WOD_routine = '';
                          newUser.facebook.last_login = '';
                         newUser.facebook.from = 'facebook';

                        // save our user to the database
                        newUser.save( function(err) {
                            if (err)
                                throw err;


        User.findOne({'local.role':'admin'}).exec( function (err,admin){
var adj = [];
  adj.push(admin.id);

                     var notificatn = new notification();
    
                    notificatn.userId = newUser.id;
                    notificatn.type = 'signUp';
                     notificatn.created_at = new Date();
                    notificatn.updated_at = new Date();
                     notificatn.status = adj;
                      notificatn.UserRecord = adj;
                    
                   console.log(notificatn);

                 notificatn.save(function(err, res) {
                     if (err) {

                   // res.send('err');
                    } else {


                    }
                });
});



                            // if successful, return the new user
                            return done(null, newUser);
                        });
}

                        // if there is no user found with that facebook id, create them
                      
                        // set all of the facebook information in our user model
                    
                    }

                });
            });

        }));




};