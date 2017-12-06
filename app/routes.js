// app/routes.js

//var braintree = require('braintree');
var paypal = require('paypal-rest-sdk');
var path = require('path');
var formidable = require('formidable');
var session = require('express-session');
var multer = require('multer');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var des = path.join(__dirname, '../public/uploads/images');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/images');
    },
   filename: function (req, file, cb) {
        cb(null,  Date.now() + '_' +file.originalname)
    }
});
var upload = multer({
    storage: storage
})
var nodemailer = require("nodemailer");
var async = require("async");
var crypto = require('crypto');
var fpm = require('express-php-fpm');
var each = require('async-each-series');
/************start now *************/
module.exports = function(app, passport) {

   
    var User = require('../app/models/user');
    var Video = require('../app/models/WOD');
    var Plan = require('../app/models/plan');
    var Contact = require('../app/models/contact');
    var Category = require('../app/models/category');
      var Payment = require('../app/models/payment');
 var videoRecord = require('../app/models/wodRecord');
  var blogPost = require('../app/models/blogPost');
   var commentBlog = require('../app/models/BlogComment');
     var likes = require('../app/models/likes');

 
// =======smtpTransport

   var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'hansa.rexweb@gmail.com',
        pass: 'h@ns@th!'
    },
    tls: {rejectUnauthorized: false},
    debug:true
});


// ======= Payement



//access token : access_token$sandbox$cfsxqgmwxjdz33t5$065a1650aab5be2daa3ff23c82083531
// sendbox account :hansa.rexweb-facilitator@gmail.com
// paypal auth configuration
var config = {
  "port" : 3001,
  "api" : {
    "host" : "api.sandbox.paypal.com",
    "port" : "",            
    "client_id" : "AV80sOSfPUquHr17ykMmHIC40p-ozx80qjtOxNwsXQPXd_dloC2AeUgpl6DFwVhatznrGmPtt2e1i-CY",  // your paypal application client id
    "client_secret" : "EACupyGawWmtppiVQbSooNpyPJoqg28agN1aBLxS3EZNL-yu0ncNXonACJ1JAmB7c0L-ymV2ABqZVNIA",// your paypal application secret id
  'merchant_id':'AFcWxV21C7fd0v3bYYYRCpSSRl31Amu.HU6859mKY.D8WqhA4OaTZScY'
  }

}
 
paypal.configure(config.api);

// =====Payment
/*var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'c23wtw3v4yg5n5xb',
  publicKey: 'cx5f2rpscypk8fj2',
  privateKey: '9b681a4a5706adeefc0a7df12b61c118'
});*/


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ''
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/dashboard',
            failureRedirect: '/',
            scope: ['id', 'displayName', 'name', 'gender','email', 'picture.type(large)']
        }));

    app.post('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/dashboard',
            failureRedirect: '/',
            scope: ['id', 'displayName', 'name', 'gender','email', 'picture.type(large)']

        }));

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        //console.log(req.cookies.remember);
       res.render('login.ejs', {
            layout: 'layouts/frontend.ejs',
            message: req.flash('loginMessage'),
            title: 'LOG IN',
            user: req.user,
            status: false
        });
        res.redirect('/login');
       // res.send(req.session);
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
      if(req.param('plan')){
         var planId = req.param('plan');
      }else{
var planId;
      }
      
        // render the page and pass in any flash data if it exists
        //req.flash('signupMessage')
  Plan.find({}).exec( function(err, plan) {
        res.render('signup.ejs', {
            layout: 'layouts/frontend.ejs',
            plans :plan,
            planId : planId,
            user: req.user,
            message: req.flash('signupMessage'),
            title: 'Sign Up',
             status: false
        });
    });
   });
    // process the signup form
    // app.post('/signup', do all our passport stuff here);


    // process the signup form  
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/paynow', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true, // allow flash messages
        successFlash: true // allow flash messages
    }));


    // show the forget form
    app.get('/forgot', function(req, res) {

        //console.log(req.cookies.remember);
        res.render('forgot.ejs', {
            layout: 'layouts/frontend.ejs',
            message: req.flash('forgotMessage'),
            title: 'Forget Password',
            status: false,
              user: req.user
        });
    });

//reset password
app.post('/forgot', function(req, res, next) {
   async.waterfall([
   function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ 'local.email': req.body.email }, function(err, user) {
        if (!user) {
          req.flash('forgotMessage', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
   function(token, user, done) {
User.findOne({'local.role':'admin'}, function(err, admin) {
      var mailOptions = {
        to: user.local.email,
        from: admin.local.email,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('loginMessage', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
        done(err, 'done');
        return res.redirect('/login');
      });
    });  
    }
  ], function(err) {
      req.flash('forgotMessage', err);
    if (err) return next(err);
     //res.redirect('/forgot');
  });
});

//reset token
app.get('/reset/:token', function(req, res) {
  User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('loginMessage', 'Password reset token is invalid or has expired.');
      return res.redirect('/login');
    }else{
    res.render('reset.ejs', {
      user: req.user,
      layout: 'layouts/frontend.ejs',
    error: req.flash('error'),
    title: 'Reset Password',
    token : req.params.token,
    status: false,
     user: req.user
    });
}
  });
});

app.post('/reset/:token', function(req, res) {

  async.waterfall([
    function(done) {
     User.findOne({'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
   // console.log(req);

    if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }else{
           
var hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
        user.local.password = hashedPassword;
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;

        user.save(function(err) {
           
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
    }
      });
    },
    function(user, done) {
User.findOne({'local.role':'admin'}, function(err, admin) {       
      var mailOptions = {
        to: user.local.email,
        from: admin.local.email,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('loginMessage', 'Success! Your password has been changed.');
      //  done(err);
       return res.redirect('/login');
      });
  });
    }
  ], function(err) {
     //req.flash('loginMessage',err);
  // return res.redirect('/login');
  });
});


 
// Page will display after payment has beed transfered successfully
app.get('/success', function(req, res) {
 
   var package = req.session.planTaken;      
     Plan.findOne({'_id': package}).exec( function(err, plan) {
 if(plan){
   var payDetails = new Payment();
                payDetails.userId = req.session.logUser;
                payDetails.packageId = package;
                payDetails.amount = plan.price;
                payDetails.currency = plan.currency;
                payDetails.duration = plan.plan_duration;
                payDetails.paymentId = req.session.paymentId;
                 payDetails.created_at = new Date();
                 payDetails.updated_at = Date.now();
                
             
               payDetails.save(function(err, data) {
                     if (err) {
                    res.send(err);
                    } else {

                         videoRecord.find({'userId':req.session.logUser}).exec(function(err, place) {
    if(place){
 each(place, function(el, next) {

  videoRecord.findByIdAndRemove(el._id, function(err, place) {
            if (err) {
               console.log('yes err');
            } else {
                console.log('yes deleted');
            }
});
next();
});
}
 });




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


                        User.findByIdAndUpdate(req.session.logUser, {
                           'local.PayComplete':'yes',
                            'local.PlanExpried_at':expriedDate
                    }, function(err, place) {
                       
                    });
                   console.log(res.locals.login);    
                     req.flash("loginMessage",'Payment successfully submit.');
                    //  res.redirect("/login");
                           res.render('user/success.ejs', {
                layout: 'layouts/frontend.ejs',
                title: 'Success',
                payDetails : data,
                status: res.locals.login,
                message : req.flash("message"),
                user : req.user
            });

                   });
                    }

                     
                });
           }
   }); 

});
 
// Page will display when you canceled the transaction 
app.get('/cancel', function(req, res) {
     req.flash("message",'Payment canceled successfully.');
                   //   res.redirect("/login");
                         res.render('user/cancel.ejs', {
                layout: 'layouts/frontend.ejs',
                title: 'Cancel',
                status: res.locals.login,
                 user : req.user,
                message : req.flash("message")
            });

});

 
app.get('/paynow', function(req, res) {
   // paypal payment configuration.
  // console.log(req.body);
  // console.log(app.locals.baseurl);
  //Id used for paypal : chhabeg.rex@gmail.com , chhabeg@123 
  //pay from vishvakarma.rexweb@gmail.com , vishvakarma
   var package = req.session.planTaken;  
   
         Plan.findOne({'_id': package}).exec( function(err, plan) {

if(plan.price !== '0'){
   var SUCC = req.protocol + '://' + req.get('host') + '/success';
  var CANC = req.protocol + '://' + req.get('host') + '/cancel';
       $price =plan.price;
   var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": SUCC,
    "cancel_url": CANC
  },
 "transactions": [{
    "amount": {
      "total": $price,
      "currency": 'USD'
    },
    "description": "My awesome payment"
}]
};                         




//console.log(payment);
  paypal.payment.create(payment, function (error, payment) {
  if (error) {
    console.log(error);
  } else {   
    if(payment.payer.payment_method === 'paypal') {
    //  req.paymentId = payment.id;
     req.session.paymentId = payment.id;
      var redirectUrl;
      //console.log(payment.id);
      //console.log(payment);
      for(var i=0; i < payment.links.length; i++) {
        var link = payment.links[i];
        if (link.method === 'REDIRECT') {
          redirectUrl = link.href;
          console.log(redirectUrl);
        }
      }
      res.redirect(redirectUrl);
    }
  }
});
  }else{
    req.flash('loginMessage','Signup successfully');
    return res.redirect('/login');
}
  });
});
app.get('/execute', function(req, res) {
exports.execute = function(req, res){
  var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');

  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
     // console.log(error);
    } else {
     // res.send("Hell yeah!");
    }
  });
};

});

/*app.get('/payment', function(req, res) {
    res.render('payment.ejs',{ 
        layout:'layouts/frontend.ejs', 
        title: 'Payment Now',
        status : false
       });
});

 app.post('/paynow', function(req, res) {
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'c23wtw3v4yg5n5xb',
  publicKey: 'cx5f2rpscypk8fj2',
  privateKey: '9b681a4a5706adeefc0a7df12b61c118'
});
 
gateway.transaction.sale({
  amount: '10.00',
  paymentMethodNonce: 'nonce-from-the-client',
  options: {
    submitForSettlement: true
  }
}, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
 
  if (result.success) {
    console.log('Transaction ID: ' + result.transaction.id);
    res.send(result.transaction.id);
  } else {
    console.error(result.message);
    res.send(result.message);
  }
});
});*/

// --payment end

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        // res.send(req.user.local.user_name);


      User.findById(req.user, function(err, doc) {

            if(req.user.local.role == 'admin'){
                res.render('admin/profile/profile.ejs', {
                    user: req.user, // get the user out of session and pass to template   
                    message: req.flash('message'),
                    title: 'Profile'
                });
            }else{
if(req.user.facebook.from == 'facebook'){
var  userDetail = req.user.facebook;
}else{
userDetail = req.user.local;  
}

               res.render('user/profile.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    message: req.flash('message'),
                     layout: 'layouts/frontend.ejs',
                     status : res.locals.login,
                     userDetail : userDetail,
                     title: 'Profile'     
                });



             }
        });
    });
//upload file

   app.post('/upFile', isLoggedIn, upload.any(), function(req, res) {
 var photo = req.files[0]['filename'];
if(req.user.local.from == 'local'){
 User.findById(req.user.id, function(err, doc) {
var oldPhoto = doc.local.photo;
if(oldPhoto.length > 0){
    fs.unlink(des + '/' + oldPhoto, (err) => {
             // if (err) throw err;
            });
    }
  });
  User.findByIdAndUpdate(req.user.id, {
                        'local.photo': photo
                    }, function(err, place) {
   res.end(photo);
 
                    });
}else{
     User.findById(req.user.id, function(err, doc) {
var oldPhoto = doc.facebook.photo;
if(oldPhoto.length > 0){
    fs.unlink(des + '/' + oldPhoto, (err) => {
             // if (err) throw err;
            });
    }
  });
  User.findByIdAndUpdate(req.user.id, {
                        'facebook.photo': photo
                    }, function(err, place) {
    res.end(photo);
                    });

              }
                   }); 
    //dashboard for admin
    app.get('/dashboard', isLoggedIn, function(req, res) {
      
    

     User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
           
   User.find({$and : [{ $or: [{'local.status':1},{'facebook.status':1}] },{$or: [{'local.role':'user'},{'facebook.role':'user'}] } ] }).sort('-created_at').exec( function (err,getUsers){
     var count = getUsers.length;  
Plan.find({}).exec( function (err , plans){



               res.render('dashboard.ejs', {
                    user: req.user.local, // get the user out of session and pass to template
                title: 'Dashboard',
                getUsers : getUsers,
                total :count,
                plan : plans
                });
                });


   });

            } else if (doc.local.role == 'user' && doc.local.status == '1') {
              if(doc.local.last_login){
                res.redirect('/userDashboard');
              }else{
                             var useId =req.user._id;

     User.findByIdAndUpdate(useId, {
    'local.last_login' : new Date()

 }, function(err, get) {
                    });
  


                 res.redirect('/profile');
              }
             } else if (doc.facebook.role == 'user') {
             if(doc.facebook.last_login){ 
               res.redirect('/userDashboard');
             }else{
               User.findByIdAndUpdate(useId, {
    'facebook.last_login' : new Date()

 }, function(err, get) {
                    });
                res.redirect('/profile');

             }
             }else{
                req.flash('loginMessage', "You account is not activate");
                res.redirect('/login');
            }
        });
       
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/login');
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
    }


    /*****************close*********************/
};