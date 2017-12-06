// adminController.js 
 
  var passwordHash = require('../lib/password-hash');
var multer  = require('multer') 
var path = require('path')
var fs = require('fs')
var bcrypt = require('bcrypt-nodejs');
var each = require('async-each-series');
var sanitizeHtml = require('sanitize-html');
var async = require('async');

   

/*var upload = multer({
 // destination: path.join(__dirname, '../public/uploads/video'),
  destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/video'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});*/
var desImg = path.join(__dirname, '../public/uploads/addBlog');

var des = path.join(__dirname, '../public/uploads/video');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, des)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var upload = multer({ storage: storage });
/*********** upload home page image start***************/
var homedes=path.join(__dirname, '../public/uploads/homepageimage');
var homestorage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, homedes)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var upldhomeimg= multer({ storage: homestorage });
/********* upload home page image end*************/
/*********** upload trainer profile start***************/
var profdes=path.join(__dirname, '../public/uploads/trainerprofile');

var profilestorage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profdes)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var trainerupload=multer({ storage: profilestorage });
/*********** upload trainer profile end***************/
/*********** upload training type image start***************/
var trainingtypedes=path.join(__dirname, '../public/uploads/trainingtype');

var trainingtypetorage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, trainingtypedes)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});

var trainingupload=multer({ storage: trainingtypetorage });
/*********** upload trainer type image end***************/


/*********** banner  image upload code start***************/
var bannerdes=path.join(__dirname, '../public/uploads/bannerimage');

var bannerstorage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, bannerdes)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var bannerupload=multer({ storage: bannerstorage });

/*********** banner  image upload code end***************/


var dest = path.join(__dirname, '../public/uploads/images');
var storag = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var uploaded = multer({ storage: storag });


  var desblog = path.join(__dirname, '../public/uploads/blog');

var storageblog = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, desblog)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var uploadblog = multer({ storage: storageblog });

//post
 var desPost = path.join(__dirname, '../public/uploads/post');
var storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, desPost)
    },
    filename: function (req, file, cb) {
        cb(null,  new Date() + '_' +file.originalname)
    }
});
var uploadPost = multer({ storage: storagePost });


module.exports = function(app, passport) {
//model calls
    var User = require('../app/models/user');
    var Video = require('../app/models/WOD');
    var Plan = require('../app/models/plan');
    var content = require('../app/models/content');
    var trainercontent = require('../app/models/trainercontent');
     var Category = require('../app/models/category');
      var commentBlog = require('../app/models/BlogComment');
     var likes = require('../app/models/likes');
     var homeimage = require('../app/models/homeimage');
     var trainerinfo = require('../app/models/trainerinfo');
     var chat = require('../app/models/chat');
//file upload
  var traininginfo = require('../app/models/traininginfo');
var subscplancontent = require('../app/models/subscplancontent');
var banner = require('../app/models/banner');

    var cpUpload = upload.single('video_link');
     var uploadedUp = uploaded.single('photo'); 
      var blogPost = require('../app/models/blogPost');
      var notification = require('../app/models/notification');
var timeAgo = require('node-time-ago');
var Post = require('../app/models/post');
  var PostComment = require('../app/models/PostComment');
/*
*
User section
*
*
/
/***************start User Section **********/

    /**************Add New User************/
    app.get('/add_user', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
               Plan.find({}).exec( function(err, plan) {
        res.render('admin/user/addUser.ejs', {
           user: req.user.local,
            plans :plan,
            message: ''
        });
    });
     
            }
        });

    });


     /*******Submit User from********/
    app.post('/add_user', isLoggedIn, function(req, res) {
        User.find({ $or:[ {
            'local.email': req.body.email},
            {'local.user_name': req.body.user_name}]
        }, function(err, user) {
            if (user.length) {
              var mesg;

if(user[0].local.user_name == req.body.user_name && user[0].local.email == req.body.email){
  mesg = 'User Name && Email already exist.';
}else if(user[0].local.user_name == req.body.user_name){
mesg = 'User Name already exist.';
}else{
  mesg = 'Email already exist.';
}

                Plan.find({}).exec( function(err, plan) {
                res.render('admin/user/addUser.ejs', {
                    user: req.user.local,
                     plans :plan,
                    message: mesg // get the user out of session and pass to template   
                });
                });

            } else {
          Plan.findById(req.body.package, function(err, pLan) {

              
                var saveUser = new User();


                saveUser.local.user_name = req.body.user_name;
                saveUser.local.first_name = req.body.first_name;
                saveUser.local.email = req.body.email;
                saveUser.local.last_name = req.body.last_name;
                saveUser.local.password = saveUser.generateHash(req.body.password);
                saveUser.local.role = req.body.role;
                saveUser.local.plan_id = req.body.package;
                saveUser.local.status = req.body.status;
                saveUser.local.goal = '';
                saveUser.local.photo = '';
                 saveUser.local.from = 'local';
                saveUser.local.phone = '';
                saveUser.local.height = '';
                saveUser.local.weight = '';
                saveUser.local.waist = '';
                saveUser.local.fitness = '';
                saveUser.local.country = '';
                 saveUser.local.PayComplete = '';


                 if(pLan.plan_name == 'Free Trial'){
                saveUser.local.plan_at = new Date();
              }

                
                 saveUser.local.age = '';
                saveUser.local.created_at = new Date();
                saveUser.local.updated_at = new Date();
                 saveUser.local.WOD_routine =  '';
                
                saveUser.save(function(err, data) {
                    if (err) {
                        res.render('admin/user/addUser.ejs', {
                            user: req.user.local,
                            message: err // get the user out of session and pass to template    
                        });
                    } else {
                       req.flash('message','Insert Successfully');
                        res.redirect('/user_list');
                    }
                });
                });
            }

        });
    });

 

 /*****List all User ********/
    app.get('/user_list', isLoggedIn, function(req, res) {

        User.findById(req.user, function(err, doc) {
            //console.log(doc);
            if (doc.local.role == 'admin') {
                User.find({
                  $or:[{'local.role' : 'user'},
              {'facebook.role': 'user' }]
                }).sort('-created_at').exec(function(err, users) {
          
         

           Plan.find({}).exec(function(err, plans) {

                    res.render('admin/user/userList.ejs', {
                        user: req.user.local,
                        usersList: users,
                        plan :plans,
                        message: req.flash('message')
                    });

                });
            });
            }
        });
    });
    



 /***Action view/edit/delete all user**#**/

    app.get('/userAction', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                var status = req.param("status");
               // console.log(status);
                var userId = req.param("id");
                if (status == 'view') {
                  
                    User.findById(userId, function(err, userView) {
                        res.render('admin/user/userView.ejs', {
                            user: req.user.local,
                            usersView: userView
                        });
                    });
                } else if (status == 'edit') {
                    User.findById(userId, function(err, place) {
                if(place.local.from =='local'){
                      Plan.find({}).exec( function(err, plan) {
                        res.render('admin/user/editUser.ejs', {
                            editUser: place.local,
                             userId: place._id,
                            message: req.flash('message'),
                            plans: plan,
                            user: req.user.local
                        });
 });
                  }else{

                                  Plan.find({}).exec( function(err, plan) {
                        res.render('admin/user/editUser.ejs', {
                            editUser: place.facebook,
                             userId: place._id,
                            message: req.flash('message'),
                            plans: plan,
                            user: req.user.local
                        });
 });

                  }
                    });

                } else if (status == 'upStatus') {
                    var change = req.param("log");
                    if (change == '0') {
                        var num = '1';
                        var mesg = 'User is active.';
                    } else {
                        var num = '0';
                        var mesg = 'User is not active now.';
                    }
                    User.findByIdAndUpdate(userId, {
                        'local.status': num
                    }, function(err, place) {

             
                        req.flash('message',mesg);
                        res.redirect('/user_list');

                    });

                }
            }
        });
    });
    

/******update user**************/
    app.post('/userAction', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                var status = req.param("status");
                var userId = req.param("id");
                var place = req.param("plac");
                
                if (status == 'update') {
  User.findOne({ $and: [ {'_id':{'$ne':userId}} , {$or:[{'local.user_name' : req.body.user_name},
              {'local.email': req.body.email },{'facebook.user_name' : req.body.user_name},{'facebook.email': req.body.email }]} ]
            }).exec( function(err, user) {
        
            if (user) {
             
              var mesg;

if((user.local.email == req.body.email || user.facebook.email == req.body.email)&&(user.local.user_name == req.body.user_name ||  user.facebook.user_name == req.body.user_name)){
 
  mesg = 'User Name or Email already exist.';
   req.flash('message',mesg);
     res.redirect('back');
}else if(user.local.user_name == req.body.user_name ||  user.facebook.user_name == req.body.user_name){
 
mesg = 'User Name already exist.';
 req.flash('message',mesg);
     res.redirect('back');
}else if(user.local.email == req.body.email || user.facebook.email == req.body.email){
  
  mesg = 'Email already exist.';
   req.flash('message',mesg);
     res.redirect('back');
}
}else{
if(place == 'facebook'){
  
  User.findById( userId,function(err, userGet) {



      Plan.findById(req.body.package, function(err, pLan) {

         if(pLan.plan_name == 'Free Trial' && userGet.facebook.plan_id != req.body.package){

             User.findByIdAndUpdate(userId, {
                        'facebook.user_name': req.body.user_name,
                        'facebook.first_name': req.body.first_name,
                        'facebook.last_name': req.body.last_name,
                        'facebook.email': req.body.email,
                        'facebook.goal': req.body.goal,
                        'facebook.plan_id' : req.body.package,
                        'facebook.height' : req.body.height,
                         'facebook.age' : req.body.age,
                        'facebook.weight' : req.body.weight,
                        'facebook.waist' : req.body.waist,
                        'facebook.fitness' : req.body.fitness,
                        'facebook.updated_at' : new Date(),
                         'facebook.plan_at' : new Date(),
                          //  'facebook.WOD_routine' : req.body.WOD_routine

                        

                    }, function(err, place) {
                         req.flash('message','User Record Update Successfully');
                        res.redirect('/user_list');

                    });
              }else{
if(userGet.facebook.plan_id != req.body.package){


                    User.findByIdAndUpdate(userId, {
                        'facebook.user_name': req.body.user_name,
                        'facebook.first_name': req.body.first_name,
                        'facebook.last_name': req.body.last_name,
                        'facebook.email': req.body.email,
                        'facebook.goal': req.body.goal,
                        'facebook.plan_id' : req.body.package,
                        'facebook.height' : req.body.height,
                         'facebook.age' : req.body.age,
                        'facebook.weight' : req.body.weight,
                        'facebook.waist' : req.body.waist,
                        'facebook.fitness' : req.body.fitness,
                        'facebook.updated_at' : new Date(),
                         'facebook.plan_at' : '',
                        'facebook.PayComplete' : '',
                          //  'facebook.WOD_routine' : req.body.WOD_routine

                        

                    }, function(err, place) {
                         req.flash('message','User Record Update Successfully');
                        res.redirect('/user_list');

                    });
                    
}else{

                    User.findByIdAndUpdate(userId, {
                        'facebook.user_name': req.body.user_name,
                        'facebook.first_name': req.body.first_name,
                        'facebook.last_name': req.body.last_name,
                        'facebook.email': req.body.email,
                        'facebook.goal': req.body.goal,
                        'facebook.plan_id' : req.body.package,
                        'facebook.height' : req.body.height,
                         'facebook.age' : req.body.age,
                        'facebook.weight' : req.body.weight,
                        'facebook.waist' : req.body.waist,
                        'facebook.fitness' : req.body.fitness,
                        'facebook.updated_at' : new Date(),

                          //  'facebook.WOD_routine' : req.body.WOD_routine

                        

                    }, function(err, place) {
                         req.flash('message','User Record Update Successfully');
                        res.redirect('/user_list');

                    });
                  }
                }
                  });
                });
                }else{
                   User.findById( userId,function(err, userGet) {
                   
                     Plan.findById(req.body.package, function(err, pLan) {

         if(pLan.plan_name == 'Free Trial' && userGet.local.plan_id != req.body.package){
                
                      User.findByIdAndUpdate(userId, {
                        'local.user_name': req.body.user_name,
                        'local.first_name': req.body.first_name,
                        'local.last_name': req.body.last_name,
                        'local.email': req.body.email,
                        'local.goal': req.body.goal,
                        'local.plan_id' : req.body.package,
                        'local.height' : req.body.height,
                        'local.weight' : req.body.weight,
                        'local.waist' : req.body.waist,
                        'local.age' : req.body.age,
                        'local.fitness' : req.body.fitness,
                        'local.updated_at' : new Date(),
                        'local.plan_at' : new Date(),
                      //  'local.WOD_routine' : req.body.WOD_routine

                        

                    }, function(err, place) {
                         req.flash('message','User Record Update Successfully');
                        res.redirect('/user_list');

                    });
                    }else{

if(userGet.local.plan_id != req.body.package){

    User.findByIdAndUpdate(userId, {
                        'local.user_name': req.body.user_name,
                        'local.first_name': req.body.first_name,
                        'local.last_name': req.body.last_name,
                        'local.email': req.body.email,
                        'local.goal': req.body.goal,
                        'local.plan_id' : req.body.package,
                        'local.height' : req.body.height,
                        'local.weight' : req.body.weight,
                        'local.waist' : req.body.waist,
                        'local.age' : req.body.age,
                        'local.fitness' : req.body.fitness,
                        'local.updated_at' : new Date(),
                        'local.plan_at' : '',
                        'local.PayComplete' : '',
            
                        

                    }, function(err, place) {
                         req.flash('message','User Record Update Successfully');
                        res.redirect('/user_list');

                    });

}else{

                        User.findByIdAndUpdate(userId, {
                        'local.user_name': req.body.user_name,
                        'local.first_name': req.body.first_name,
                        'local.last_name': req.body.last_name,
                        'local.email': req.body.email,
                        'local.goal': req.body.goal,
                        'local.plan_id' : req.body.package,
                        'local.height' : req.body.height,
                        'local.weight' : req.body.weight,
                        'local.waist' : req.body.waist,
                        'local.age' : req.body.age,
                        'local.fitness' : req.body.fitness,
                        'local.updated_at' : new Date(),
                      //  'local.WOD_routine' : req.body.WOD_routine

                        

                    }, function(err, place) {
                         req.flash('message','User Record Update Successfully');
                        res.redirect('/user_list');

                    });
}
                    }
                  });
                      });
                }
                }
             });
}
}
        });
    });

    app.get('/delUser', isLoggedIn, function(req, res) {
        var userId = req.param("id");
       User.findByIdAndRemove(userId, function(err, place) {
            if (err) {
               res.send(err);
            } else  {




notification.find({'userId':userId}).exec( function (err, findNotictn){
if(findNotictn){
if(findNotictn.length){
   for(var j=0;j<findNotictn.length; j++) {
  if(findNotictn[j].id){
    console.log(findNotictn[j].id);
  var id = findNotictn[j].id;
 // res.send(el.id);
 notification.findByIdAndRemove(id, function(err, getOne) {
            if (err) {
               // res.send('err notification');
            }
  }); 
}

}
}
}
});
  


commentBlog.find( {'userId': userId}, function( err, blogCommt) {

if(blogCommt){
if(blogCommt.length){
   console.log(blogCommt);
for(var j=0;j<blogCommt.length; j++) {
  if(blogCommt[j].id){
    console.log(blogCommt[j].id);
  var id = blogCommt[j].id;
commentBlog.findByIdAndRemove(id, function(err, removeCom) {
  if(err){
    //res.send(err);
  }else{

  }
 }); 
}
}
}
}
 });



              req.flash('message','User Record Delete Permanently');
                 res.redirect('/user_list');
           
      
       

}
});
}); 

    

/***************End of User section ***********************/
/*
*
WOD section
*
*
/
  /*******Add WOD from********/
    app.get('/add_WOD', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {

              
                Category.find({}).exec( function(err, cat) {
                  Plan.find({ }).exec( function(err, plan) {
         
                res.render('admin/WOD/addWOD.ejs', {
                    user: req.user.local,
                    message: '',
                    cats: cat,
                    plan : plan
                });
                 });
                   });
            }
        });

    });

   /******Save WOD********/

    app.post('/add_WOD', isLoggedIn, upload.any(), function(req, res) {
 // var filename = req.file.filename;
 var saveVideo = new Video();
              saveVideo.video_title = req.body.video_title;
                saveVideo.video_des = req.body.video_des;
                saveVideo.video_Category = req.body.video_Category;
              saveVideo.WOD_plan = req.body.WOD_plan;
               saveVideo.order = req.body.order;

var files = req.files;
var i=1;
files.forEach(function(file) {
   if(i == '1'){
saveVideo.video_link = file.filename;
   }else{
    saveVideo.video_img = file.filename;
   }

 i++;});
               saveVideo.save(function(err, data) {
                    if (err) {
                       res.redirect('/add_WOD');
                    } else {
                       req.flash('message','Video Insert Successfully');
                        res.redirect('/WOD_list');
                    }
                });
                   });



  /**********WOD List **********/
     app.get('/WOD_list', isLoggedIn, function(req, res) {

        User.findById(req.user, function(err, doc) {
            //console.log(doc);
            if (doc.local.role == 'admin') {

                Video.find({}).sort('order').exec(function(err, videos) {
                Plan.find({}, function(err, plan) {
                    
                        res.render('admin/WOD/WODList.ejs', {
                        user: req.user.local,
                        videoList: videos,
                        plan : plan,
                         sanitizeHtml : sanitizeHtml,
                        message: req.flash('message')
                    });

               
                            });
                           });
            }
        });
    });
/********SAVE ODER WORKOUT LIST******/

 app.post('/orderWODList', isLoggedIn, function(req, res) {

 var data = req.body.data.toString().split('br');

    //var data = req.body.data.toString().split('br');
  each(data, function(el, next) {

 var data1 = el.toString();
 var res = data1.split(',');
var result = res.filter(function(v){return v!==''});

var j=1;
var order;
var ids;

if(result.length > 0){
  
 each(result, function(ell, next) {

 if(j == 2){
  ids = ell;

   Video.findByIdAndUpdate(ids, {
    'order' : order

 }, function(err, get) {
                  //  console.log('save');
                    });
}else{


if(j == 1){
    order = ell;
}
}
 j++; next(); 
  });
}

   next(); });

res.send('Update');
               });




/********get WOD Plan last OrDER NUmber ************/

  app.post('/getUniqueOrder', function(req, res) {
    var planId = req.body.planId;
   
 JSON.stringify(planId);

   Video.find({'WOD_plan': planId}).sort('-order').limit(1).exec( function(err, wod) {
if(wod.length){
  console.log(wod[0].order);

var number = wod[0].order;
}else{
 var number = 'false';
}
JSON.stringify(number);
  res.send(number)
 });
  });
  
 /***Edit WOD Form**#**/
  
    app.get('/editWOD', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
           // console.log(doc);
            if (doc.local.role == 'admin') {
                var status = req.param("status");
               // console.log(status);
                var videoId = req.param("id");
                    Video.findById(videoId, function(err, place) {
 Category.find({}).exec( function(err, cat) {
                       Plan.find({ }).exec( function(err, plan) {
         
                res.render('admin/WOD/editWOD.ejs', {
                            editVideo: place,
                            message: false,
                            user: req.user.local,
                            cats :cat,
                            plan :plan
                        });
                 });
                       });
                    });

             
            }
        });
    });

/** update WOD***/


   app.post('/UpdateWOD', isLoggedIn, upload.any(), function(req, res) {
  //console.log(req.file);
        //console.log(req);
       User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
               
                var videoId = req.param("id");
       var str = req.files;  
      
 if(str.length > 0){ 
  var oldFile = req.body.old_file;
  fs.unlink(des + '/' + oldFile, (err) => {
       // if (err) throw err;
      });

    var oldFile = req.body.old_img;
    fs.unlink(des + '/' + oldFile, (err) => {
            //  if (err) throw err;
            });   
var i=1;
var video  = [];
str.forEach(function(file) {
   if(i == '1'){
  video[i] = file.filename;
   }else{
    video[i] = file.filename;
   }

 i++;});
   Video.findByIdAndUpdate(videoId, {
                        'video_title' :req.body.video_title,
                        'video_des' :req.body.video_des,
                        'video_link' :video[1],
                        'video_img' :video[2],
                         'video_Category' :req.body.video_Category,
                         'WOD_plan':req.body.WOD_plan
                    
                    }, function(err, place) {
                         req.flash('message','Video Update Successfully');
                        res.redirect('/WOD_list');

                    });

              }else{
             Video.findByIdAndUpdate(videoId, {
                        'video_title' :req.body.video_title,
                        'video_des' :req.body.video_des,
                         'video_Category' :req.body.video_Category,
                          'WOD_plan':req.body.WOD_plan
                    
                    }, function(err, place) {
                         req.flash('message','Video Update Successfully');
                        res.redirect('/WOD_list');

                    });
              }
            }
        });
    });

/****delete WOD***/
    app.get('/delVideo', isLoggedIn, function(req, res) {
        var videoId = req.param("id");
        var video = req.param("video");
        var img = req.param("img");
        var planId = req.param("plan"); 


    fs.unlink(des + '/' + video, (err) => {
      //  if (err) throw err;
      });
    fs.unlink(des + '/' + img, (err) => {
            //  if (err) throw err;
            });

        Video.findByIdAndRemove(videoId, function(err, place) {
            if (err) {
                res.send(err);
            } else {


    Video.find({'WOD_plan':planId}).sort('order').exec( function(err, WOD) {
 var i =1;
each(WOD, function(element,next){

  Video.findByIdAndUpdate(element.id, {
    'order' : i

 }, function(err, get) {
                    });
 i++; next();
  });
});
    req.flash('message','Video has been Delete Permanently');
                 res.redirect('/WOD_list');
            }
        });

    });



  /*****Admin Profile edit***/
     app.post('/profileUpdate',  isLoggedIn, uploadedUp, function(req, res) {

       User.findById(req.user, function(err, doc) {

            if (doc.local.role == 'admin') {


                   var str = req.file;      
 if(str){ 

    var oldFile = req.body.old_file;
    fs.unlink(dest + '/' + oldFile, (err) => {
             // if (err) throw err;
            });

         var filename = req.file.filename;
        User.findByIdAndUpdate(req.user.id, {
                        'local.user_name' :req.body.user_name,
                        'local.first_name' :req.body.first_name,
                       'local.last_name' :req.body.last_name,
                         'local.email' :req.body.email,
                         'local.photo':filename
                    
                    }, function(err, place) {
                         req.flash('message','Details Update Successfully');
                        res.redirect('/profile');

                    });
         
     }else{
     User.findByIdAndUpdate(req.user.id, {
                        'local.user_name' :req.body.user_name,
                        'local.first_name' :req.body.first_name,
                       'local.last_name' :req.body.last_name,
                         'local.email' :req.body.email
                    
                    }, function(err, place) {
                         req.flash('message','Details Update Successfully');
                        res.redirect('/profile');

                    });


     }
 }
           });
       });

     /*****Change Password ***/  
 app.post('/pwdChange', isLoggedIn, function(req, res) {

       User.findById(req.user, function(err, doc) {
       //  if (doc.local.role == 'admin') {
     
     var hashedPassword = doc.local.password;
     //console.log(doc.validPassword(req.body.old_pwd));
                if(doc.validPassword(req.body.old_pwd)){
//update
      var hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);

                   User.findByIdAndUpdate(req.user.id, {
                        'local.password' : hashedPassword
                    
                    }, function(err, place) {
                         req.flash('message','Password has been Update Successfully');
                        res.redirect('/profile');

                    });

                }else{
                  //error old password is wrong
              req.flash('message','Old Password is wrong. Password not updated.Please try again.');
                        res.redirect('/profile');
                }
         //   }
 
           });
       });
 /*
 *
 PLans
 *
 /
 /*****Add plans***/
    app.get('/add_plan', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                res.render('admin/plan/addPlan.ejs', {
                    user: req.user.local,
                    message: '' // get the user out of session and pass to template     
                });
            }
        });

    });

   /******Save WOD********/

    app.post('/add_plan', isLoggedIn, function(req, res) {
 
         var savePlan = new Plan();
              savePlan.plan_name = req.body.plan_name;
              savePlan.price = req.body.price;
              savePlan.currency = req.body.currency;
              savePlan.plan_duration = req.body.plan_duration;

               savePlan.save(function(err, data) {
                    if (err) {

                        res.render('admin/plan/addPlan.ejs', {
                            user: req.user.local,
                            message: err // get the user out of session and pass to template        
                        });
                    } else {
                         req.flash('message','Plan Insert Successfully');
                        res.redirect('/plan_list');
                    }
                });
                   });

      /**********Plan List **********/
    app.get('/plan_list', isLoggedIn, function(req, res) {

        User.findById(req.user, function(err, doc) {
            //console.log(doc);
            if (doc.local.role == 'admin') {
                Plan.find({}).exec(function(err, plan) {
                 
                    res.render('admin/plan/planList.ejs', {
                        user: req.user.local,
                        planList: plan,
                        message: req.flash('message')
                    });

                });
            }
        });
    });
/***Action edit/delete all plan**#**/

    app.get('/editPlan', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
              
                var planId = req.param("id");
              
                    Plan.findById(planId, function(err, place) {
                     
                       res.render('admin/plan/editPlan.ejs', {
                            editPlan: place,
                            message: false,
                            user: req.user.local
                        });

                    });
            }
        });
    });
/***update Plan**/
 app.post('/updatePlan', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                var status = req.param("status");
             console.log(req.body);
                var planId = req.param("id");
             if (status == 'update') {
                     Plan.findByIdAndUpdate(planId, {
                        'plan_name' : req.body.plan_name,
                        'price' : req.body.price,
                         'currency' : req.body.currency,
                         'plan_duration' : req.body.plan_duration

                    
                    }, function(err, place) {
                         req.flash('message','Plan Update Successfully');
                        res.redirect('/plan_list');

                    });

                }

            }
        });
    });

/****delete plan**/
    app.get('/delPlan', isLoggedIn, function(req, res) {
        var planId = req.param("id");
   
        Plan.findByIdAndRemove(planId, function(err, place) {
            if (err) {
                res.send(err);
            } else {
                 req.flash('message','Plan has been Delete Permanently');
                  res.redirect('/plan_list');
            }
        });

    });
/*
*
Category
*
*/

  /*******Add home page content start********/
  app.get('/add_home_content',  function(req, res) {

 var catId = '59f9be1aa40c152bc990f98f';
    var contentid2='59faef18ce5da81b59c70a34';          
       var homeimgid="59fc0e3e20942a15d7633cfd" ;
       var contentplanid="5a002bf79a62fc0bf2f14bbe" ;             
content.findById(catId,function(err, content) {
                 
                    //res.send(content);
    
  
  trainercontent.findById(contentid2,function(err, trainercontent) {
   homeimage.findById(homeimgid,function(err, homeimage) {
    trainerinfo.find({}).exec(function(err, trainerinf) {
         traininginfo.find({}).exec(function(err, traininginf) {
    subscplancontent.findById(contentplanid,function(err, plancontent) {
       banner.find({}).exec(function(err, bannerinf) {
          // notification.find({}).exec(function(err, notifications) {
   
    //trainercontent.find({}).exec(function(err, trainercontent) {
   // res.send(notifications);
    res.render('admin/content/addcontent.ejs', {
            editContent: content,
            editcontent2:trainercontent,
            editcontent3:homeimage,
            trainerinfo:trainerinf,
            traininginfo:traininginf,
            plancontents:plancontent,
             bannerinfo:bannerinf,
            message: false,
            user: req.user.local
        });

});
  });
        });  });});
});
 });
});

// });  

 app.post('/updateContent', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                
                var contentId = req.param("id");
           //res.send(contentId);
                    //  content.findByIdAndUpdate(contentId, function(err, content) {
                    //      req.flash('message','Content Update Successfully');
                    //     res.redirect('/add_home_content');

                    // });
content.findByIdAndUpdate(contentId, {
                        'content_heading' : req.body.content_heading,
                        'content_desc' : req.body.content_desc
                         }, function(err, content) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });
                

            }
        });
    });
app.post('/updatetrainContent', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                
                var contentId = req.param("id");
           //res.send(contentId);
                    //  content.findByIdAndUpdate(contentId, function(err, content) {
                    //      req.flash('message','Content Update Successfully');
                    //     res.redirect('/add_home_content');

                    // });
trainercontent.findByIdAndUpdate(contentId, {
                        'heading' : req.body.heading,
                        'desc' : req.body.desc
                         }, function(err, content) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });
                

            }
        });
    });
    app.post('/add_img', isLoggedIn, upldhomeimg.any(), function(req, res) {

          vimgId=req.param("id");      

        var files = req.files;


        files.forEach(function(file) {
   
        home_imgs = file.filename;
  

                });


            homeimage.findByIdAndUpdate(vimgId, {
                        'title' :req.body.title,
                        'home_img':home_imgs
                    
                    }, function(err, imgdata) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });



                   });
     app.get('/addtrainers', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                res.render('admin/content/addtrainer.ejs', {
                    user: req.user.local,
                    message: '' // get the user out of session and pass to template     
                });
            }
        });

    }); 
  app.post('/addtrainer_info', isLoggedIn, trainerupload.any(), function(req, res) {
 // var filename = req.file.filename;
 var trainerinf = new trainerinfo();
              trainerinf.trainer_name = req.body.trainer_name;
                trainerinf.trainer_facebook = req.body.trainer_facebook;
                trainerinf.trainer_twiter = req.body.trainer_twiter;
              trainerinf.trainer_google = req.body.trainer_google;
             trainerinf.trainig_type = req.body.trainig_type;
         
var files = req.files;
//res.send(files);

files.forEach(function(file) {
  
trainerinf.trainer_profile = file.filename;
  

 });
               trainerinf.save(function(err, data) {
                    if (err) {
                      // res.redirect('/add_WOD');
                    } else {
                       req.flash('message','Video Insert Successfully');
                        res.redirect('/add_home_content');
                    }
                });
                   });
  app.get('/edittrainer', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
              
                var trainerId = req.param("id");
              
                    trainerinfo.findById(trainerId, function(err, trainerinfo) {
                     
                       res.render('admin/content/edittrainer.ejs', {
                            editinfo: trainerinfo,
                            message: false,
                            user: req.user.local
                        });

                    });
            }
        });
    });
  app.post('/updatetrainer', isLoggedIn, trainerupload.any(), function(req, res) {

          vimgId=req.param("id");      


        var files = req.files;
//res.send(files);

files.forEach(function(file) {
  
trainer_imgs = file.filename;
  

 });


            trainerinfo.findByIdAndUpdate(vimgId, {
                        'trainer_name' :req.body.trainer_name,
                        'trainer_facebook':req.body.trainer_name,
                        'trainer_twiter':req.body.trainer_twiter,
                        'trainer_google':req.body.trainer_google,
                        'trainig_type':req.body.trainig_type,
                        'trainer_profile':trainer_imgs,
                    
                    }, function(err, imgdata) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });



                   });
app.get('/deltrainer', isLoggedIn, function(req, res) {
        var trainerId = req.param("id");
   
        trainerinfo.findByIdAndRemove(trainerId, function(err, place) {
            if (err) {
                res.send(err);
            } else {
                 req.flash('message','Trainer has been Delete Permanently');
                   res.redirect('/add_home_content');
            }
        });

    });
   app.get('/addtrainingtype', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                res.render('admin/content/addtrainingtype.ejs', {
                    user: req.user.local,
                    message: '' // get the user out of session and pass to template     
                });
            }
        });

    });

   app.post('/addtraining_type', isLoggedIn, trainingupload.any(), function(req, res) {
 // var filename = req.file.filename;
 var traininginf = new traininginfo();
              traininginf.trainer_title = req.body.trainer_title;
            

var files = req.files;
//res.send(files);

files.forEach(function(file) {
  
traininginf.training_profile = file.filename;
  

 });
               traininginf.save(function(err, data) {
                    if (err) {
                      // res.redirect('/add_WOD');
                    } else {
                       req.flash('message','Video Insert Successfully');
                        res.redirect('/add_home_content');
                    }
                });
                   });
   app.get('/edittraining', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
              
                var trainerId = req.param("id");
              
                    traininginfo.findById(trainerId, function(err, traininginfo) {
                     
                       res.render('admin/content/edittrainingtype.ejs', {
                            edittraininginfo: traininginfo,
                            message: false,
                            user: req.user.local
                        });

                    });
            }
        });
    });

    app.post('/updatetraining', isLoggedIn, trainingupload.any(), function(req, res) {

          vimgId=req.param("id");      


        var files = req.files;
//res.send(files);

files.forEach(function(file) {
  
trainer_imgs = file.filename;
  

 });
//res.send(files);

            traininginfo.findByIdAndUpdate(vimgId, {
                        'trainer_title' :req.body.trainer_title,
                        
                        'training_profile':trainer_imgs,
                    
                    }, function(err, imgdata) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });



                   });


        app.get('/user_detail', isLoggedIn, function(req, res) {
        // res.send(req.user.local.user_name);
User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
              
                var userId = req.param("id");
                //res.send(userId);
              
                    User.findById(userId, function(err, userinfo) {
                     //res.send(userinfo);
                       res.render('admin/user/userdetail.ejs', {
                            user: userinfo,
                            message: false,
                            
                        });

                    });
            }
        });

      
    });
    app.get('/deltrainingtype', isLoggedIn, function(req, res) {
        var trainerId = req.param("id");
   
        traininginfo.findByIdAndRemove(trainerId, function(err, place) {
            if (err) {
                res.send(err);
            } else {
                 req.flash('message','Trainer has been Delete Permanently');
                   res.redirect('/add_home_content');
            }
        });

    });

    app.post('/subsplanContent', isLoggedIn,function(req, res) {

            var contentplanId = req.param("id");

              

    subscplancontent.findByIdAndUpdate(contentplanId, {
                        'title' :req.body.title,
                        
                        'content_desc':req.body.content_desc,
                    
                    }, function(err, imgdata) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });     
                   });
/*******Add home page baneer start********/
    app.get('/addbanner', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                res.render('admin/content/addbannercontent.ejs', {
                    user: req.user.local,
                    message: '' // get the user out of session and pass to template     
                });
            }
        });

    }); 

app.post('/addbanner_info', isLoggedIn, bannerupload.any(), function(req, res) {

 // var filename = req.file.filename;
 var bannerinf = new banner();
              bannerinf.banner_heading = req.body.banner_heading;
                bannerinf.banner_subheading = req.body.banner_subheading;
               


var files = req.files;
//res.send(files);

files.forEach(function(file) {
  
bannerinf.banner_image = file.filename;
  

 });
               bannerinf.save(function(err, data) {
                    if (err) {
                      // res.redirect('/add_WOD');
                    } else {
                       req.flash('message','Video Insert Successfully');
                        res.redirect('/add_home_content');
                    }
                });
                   });
app.get('/edibanner', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
              
                var bannerId = req.param("id");
                //res.send(bannerId);
              
                    banner.findById(bannerId, function(err, bannerinfo) {
                     
                       res.render('admin/content/editbanner.ejs', {
                            banner: bannerinfo,
                            message: false,
                            user: req.user.local
                        });

                    });
            }
        });
    });


app.post('/updatebanner', isLoggedIn, bannerupload.any(), function(req, res) {

          vimgId=req.param("id");      


        var files = req.files;
//res.send(files);

files.forEach(function(file) {
  
banner_imgs = file.filename;
  

 });


            banner.findByIdAndUpdate(vimgId, {
                        'banner_heading' :req.body.banner_heading,
                        'banner_subheading':req.body.banner_subheading,
                        'banner_image':banner_imgs,
                    
                    }, function(err, imgdata) {
                         req.flash('message','Content Update Successfully');
                        res.redirect('/add_home_content');

                    });



                   });

app.get('/deletebanner', isLoggedIn, function(req, res) {
        var bannerId = req.param("id");
   
        banner.findByIdAndRemove(bannerId, function(err, place) {
            if (err) {
                res.send(err);
            } else {
                 req.flash('message','Banner has been Delete Permanently');
                   res.redirect('/add_home_content');
            }
        });

    });

/*******Add home page baneer start********/
    /*******Add home page content end********/


  /*******Add Category********/
    app.get('/add_category', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
                res.render('admin/category/addCategory.ejs', {
                    user: req.user.local,
                    message: '' // get the user out of session and pass to template     
                });
            }
        });

    });

   /******Save Category********/

    app.post('/add_category', isLoggedIn, function(req, res) {
 
         var saveCat = new Category();
              saveCat.name = req.body.name;

               saveCat.save(function(err, data) {
                    if (err) {

                        res.render('admin/category/addCategory.ejs', {
                            user: req.user.local,
                            message: err // get the user out of session and pass to template        
                        });
                    } else {
                         req.flash('message','Category Insert Successfully');
                        res.redirect('/category_list');
                    }
                });
                   });

      /**********Category List **********/
    app.get('/category_list', isLoggedIn, function(req, res) {
 
        User.findById(req.user, function(err, doc) {
            //console.log(doc);
            if (doc.local.role == 'admin') {
                Category.find({}).exec(function(err, category) {
                  
                    res.render('admin/category/categoryList.ejs', {
                        user: req.user.local,
                        catName: category,
                        message: req.flash('message')
                    });

                });
            }
        });
    });
/***Action edit/delete all Category**#**/

    app.get('/editCategory', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
              
                var catId = req.param("id");
              
                    Category.findById(catId, function(err, place) {
                     
                       res.render('admin/category/editCategory.ejs', {
                            editCat: place,
                            message: false,
                            user: req.user.local
                        });

                    });
            }
        });
    });
/***update Category**/
 app.post('/updateCategory', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
               
                var catId = req.param("id");
           
                     Category.findByIdAndUpdate(catId, {
                        'name' : req.body.name
                         }, function(err, place) {
                         req.flash('message','Category Update Successfully');
                        res.redirect('/category_list');

                    });

                

            }
        });
    });

/****delete Category**/
    app.get('/delCategory', isLoggedIn, function(req, res) {
        var catId = req.param("id");
   
        Category.findByIdAndRemove(catId, function(err, place) {
            if (err) {
                res.send(err);
            } else {
                 req.flash('message','Category has been Delete Permanently');
                  res.redirect('/category_list');
            }
        });

    });
/*
*
blog
*
*/
 /**************Add New blog************/
    app.get('/add_blog', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
         
        res.render('admin/blog/addblog.ejs', {
           user: req.user.local,
            message: req.flash('message')
        });

     
            }
        });

    });


    
 /*******Submit Blog*******/
    app.post('/saveBlog', isLoggedIn,uploadblog.any(), function(req, res) {

    var blog = new blogPost();
    
                    blog.userId = req.user._id;
                    blog.message = req.body.message;
                     blog.tags = req.body.tags;
                    blog.title = req.body.title;
                    blog.created_at = new Date();
                    blog.updated_at = new Date();
                    if(req.body.filenAme){
                     blog.image = JSON.stringify(req.body.filenAme);
                    }else{
                      blog.image='';
                    }
/*if(req.files){
if(req.files.length){

var requests = [];
for(var j=0;j<req.files.length; j++) {
    requests.push(req.files[j].filename);
}

JSON.stringify(requests);
      blog.image = requests;
}else{
     blog.image = '';
}
}else{
     blog.image = '';
}*/
         
  //res.send(requests);
   blog.save(function(err, data) {
                        if (err) {
                            req.flash('message', 'Error on save blog');
                            res.redirect('/add_blog');

                        } else {
                             req.flash('message', 'Blog has been save successfully');
                            res.redirect('/blog_list');
                        }
                    });
    });


    /**************List blog************/
    app.get('/blog_list', isLoggedIn, function(req, res) {

        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
       blogPost.find({}).sort('-created_at').exec( function (err, blog){
  
        res.render('admin/blog/blogList.ejs', {
           user: req.user.local,
           blogList : blog,
           sanitizeHtml : sanitizeHtml,
            message: req.flash('message')
        });

     
            
        });
     }
         });

    });

/*******delete blog *******/
    app.get('/deletBlog', isLoggedIn, function(req, res) {
     var blogId = req.param('id');
blogPost.findById(blogId, function(err, blog) {
if(blog.image){
var image = blog.image;
 var data = image.toString().split(',');
var data = data.toString().split('["');
var data = data.toString().split('"]');
var data = data.toString().split('"');
var data = data.toString().split(',');
    each(data, function(el, next) {
 fs.unlink(desImg + '/' + el, (err) => {
      //  if (err) throw err;
      });
next();
    });
}

if(blog.likes){
  var like = blog.likes;
  if(like.length){
for(var j=0;j<like.length; j++) {
if(like[j]){
  var likeId = like[j];

 likes.findByIdAndRemove(likeId, function(err, removeLike) {
 if(err){
    res.send(err);
  }
 });
 } 
}
}
}
commentBlog.find({'blogId': blogId}, function(err, blogCommt) {

if(blogCommt){
if(blogCommt.length){
for(var j=0;j<blogCommt.length; j++) {
  if(blogCommt[j].id){
  var id = blogCommt[j].id;
commentBlog.findByIdAndRemove(id, function(err, removeCom) {
  if(err){
    res.send(err);
  }
 }); 
}
}
}
}
});
notification.find({'blogId':blogId}).exec( function (err, findNotictn){
if(findNotictn){
  if(findNotictn.length){
    for(var j=0;j<findNotictn.length; j++) {
  if(findNotictn[j].id){
  var id = findNotictn[j].id;

 notification.findByIdAndRemove(id, function(err, getOne) {
            if (err) {
                //res.send(err);
            } else {
            } 
          });
}
}
}
}
});


 blogPost.findByIdAndRemove(blogId, function(err, removeBlog) {
            if (err) {
                res.send(err);
            } else {
              req.flash('message','Blog successfully delete');
      res.redirect('/blog_list');

          
            }
            });

    });
});

/*
*
notification
*
*/
/*app.post('/notification',function(req, res) {
var last = req.param('id');

  if(last != 'no'){
   
notification.find({ $and :[{'_id': { $gt: last } },{'UserRecord': { $in : [req.user._id]} },{'userId': { $nin : [req.user._id]} }] }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){

 if(result){
  console.log(result);
 if(result.length > 0){
  
  res.render('admin/element/notify.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                 count : result.length,
                 timeAgo :timeAgo
            });
}else{
  res.send('err');
}
}
});


  }else{
notification.find({ $and :[{'UserRecord': { $in : [req.user._id]} },{'userId': { $nin : [req.user._id]} }] }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){
//res.send(result);
if(result){
if(result.length > 0){
 // res.send(result);
 console.log(result.length);
  res.render('admin/element/notify.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                count : JSON.stringify(result.length),
                 timeAgo:timeAgo
            });
}else{
  res.send('err');
}
}

});
}
});*/ 

app.post('/notification',function(req, res) {
var last = req.param('id');
//res.send(req.user._id);
  if(last != 'no'){
   
notification.find({ $and :[{'_id': { $gt: last } },{'UserRecord': { $in : [req.user._id]} },{'userId': { $nin : [req.user._id]} }] }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){
//res.json(JSON.stringify(result));
 if(result){
 if(result.length > 0){
  
  res.render('admin/element/notify.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                 count : result.length,
                 timeAgo :timeAgo
            });
}
}
});


  }else{
notification.find({ $and :[{'UserRecord': { $in : [req.user._id]} },{'userId': { $nin : [req.user._id]} }] }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){
//res.json(JSON.stringify(result));
if(result){
if(result.length > 0){
 // res.send(result);
 console.log(result.length);
  res.render('admin/element/notify.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                count : JSON.stringify(result.length),
                 timeAgo:timeAgo
            });
}
}

});
}
}); 
app.post('/notificationstatus',function(req, res) {
var last = req.param('id');

  if(last != 'no'){
  
 notification.find({ $and :[{'_id': { $gt: last } },{'read': { $in : [req.user._id]} },{'userId': { $nin : [req.user._id]} }] }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){

 if(result){
  console.log(result);
 if(result.length > 0){
  
  res.render('admin/element/notify1.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                 count : result.length,
                 timeAgo :timeAgo
            });
}else{
  res.send('err');
}
}
});


  }else{
notification.find({ $and :[{'UserRecord': { $in : [req.user._id]} },{'userId': { $nin : [req.user._id]} }] }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){
//res.send(result);
if(result){
if(result.length > 0){
 // res.send(result);
 console.log(result.length);
  res.render('admin/element/notify1.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                count : JSON.stringify(result.length),
                 timeAgo:timeAgo
            });
}else{
  res.send('err');
}
}

});
}
});
/***Load More**/
app.post('/loadMoreNotifictn', function(req, res) {
var last = req.param('id');

   
notification.find({ '_id': { $lt: last }  }).populate('blogId').populate('PostId').populate('userId').limit(10).sort('-created_at').exec( function(err, result){

 if(result){
  res.render('admin/element/notify.ejs', {
                layout: false,
                 user : req.user,
                 data : result,
                 count : 'not',
                 timeAgo :timeAgo
            });
}else{
    res.send('1');

}
});

}); 

/*
*
Community
*
*/
/**************Add New blog************/
    app.get('/add_Post', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {
         
        res.render('admin/community/addPost.ejs', {
           user: req.user.local,
            message: req.flash('message'),
             error: req.flash('error')
        });

     
            }
        });

    });


    
 /*******Submit Blog*******/

 /* chat */


app.post('/startchat',function(req, res) {


 
              User.findById(req.user, function(err, doc) {
                var sender=doc.id;
                var userId = req.param("id");
                var adminphoto = req.param("adminphoto");
                //res.send(userId);
              
                    User.findById(userId, function(err, userinfo) {
                
                       res.render('startchat.ejs', {
                         user: req.user.local,
                            userRecord: userinfo,
                            adminprf:adminphoto ,
                            message: false,
                            
                            senderid:sender,
                            layout:false
                            
                        });

                    });
            
});


  });
app.post('/savechat',function(req, res) {


 
              User.findById(req.user, function(err, doc) {
                var sender=doc.id;
                var userId = req.param("receiverid");
                var msg = req.param("msg");
                var username=req.param("username");
                //res.send(userId);
                var savechat = new chat();
              savechat.reciever = userId;
              savechat.msg_desc = msg;
              savechat.sender=sender;
              savechat.role='admin';
              savechat.created_at = new Date();
               /*savechat.username=username;*/
               savechat.userid=userId;

               savechat.save(function(err, data) {
                    if (err) {

                        /*res.render('admin/plan/addPlan.ejs', {
                            user: req.user.local,
                            message: err // get the user out of session and pass to template        
                        });*/
                    } else {
                      res.json(JSON.stringify(data));
                         // req.flash('message','Plan Insert Successfully');
                       // res.redirect('/plan_list');
                    }
                });
            });



  });


app.post('/getchat',function(req, res) {
var last = req.param('chatlast'),
    sender = req.param("senderid");
//receiver = req.param("receiverid"),

if(last != 'no')
{

chat.find({ $and :[{'_id': { $gt: last } },{'userid':  sender }] }).limit(5).sort('created_at').exec( function(err, result){

res.json(JSON.stringify(result));


})


}
else
{

/*chat.find({ $and :[{'sender':  sender },{'reciever': receiver  }] }).limit(5).sort({$natural:-1}).exec( function(err, result){
*/
chat.find({ $and :[{'userid':  sender }] }).count( function(err, total){
    var totalcount="";
    if (total<5)
    {
totalcount=0;
    }
    else
    {
totalcount=total-5;
    }

chat.find({ $and :[{'userid':  sender }] }).skip(totalcount).limit(5).exec( function(err, result){

res.json(JSON.stringify(result));

}) 

}) 

}
               
            });


app.post('/loadchat',function(req, res) {

var userid = req.param('userid');

var lastid = req.param('chatlast');
//res.send(lastid);
//var adminid = req.param('adminid');
var response = { } ; 
chat.find({ $and :[{'_id': { $lt: lastid } },{'userid': userid  }] }).exec( function(err, total){
    var totalcount= total.length;
//res.json(totalcount);
    var totalcount1="";
    if (totalcount<5)
    {
totalcount1=0;
    }
    else
    {
totalcount1=totalcount-5;
    }
chat.find({ $and :[{'_id': { $lt: lastid } },{'userid': userid  }] }).skip(totalcount1).limit(5).exec( function(err, result){

//res.json(JSON.stringify(result));
//response['result'] = result ; 
res.json(JSON.stringify(result));
/*User.find({ '_id' : adminid }, function(error , adminrecord )
{

response['adminrecord'] = adminrecord ;
//response['timeAgo']=timeAgo;
res.json(JSON.stringify(response));

}) */


}) 
})



            });

 /* chat */
  
 app.post('/saveComnty', isLoggedIn,uploadPost.any(), function(req, res) {
 
     
    var blog = new Post();
     
                    blog.userId = req.user._id;
                    blog.message = req.body.message;
                    blog.title = req.body.title;
                    if(req.body.fileVideo){
                    blog.video = req.body.fileVideo;
                  }else{
                    blog.video ='';
                  }
                    blog.created_at = new Date();
                    blog.updated_at = new Date();
if(req.files){
if(req.files.length){

var requests = [];
for(var j=0;j<req.files.length; j++) {
    requests.push(req.files[j].filename);
}

JSON.stringify(requests);
      blog.image = requests;
}else{
     blog.image = '';
}
}else{
     blog.image = '';
}
  //res.send(requests);
   blog.save(function(err, data) {
                        if (err) {
                            req.flash('error', 'Error on save blog');
                            res.redirect('/add_Post');

                        } else {

 req.flash('message', 'Post has been save Successfully');
   res.redirect('/post_List');
}
 });
 });

 
 app.get('/post_List', isLoggedIn, function(req, res) {

   User.findById(req.user, function(err, doc) {
            if (doc.local.role == 'admin') {

 Post.find({})
.populate({path: 'commentsIds', options: { sort: { 'order': 1 } }, populate: {
      path: 'userId'
    } })
   // .populate('commentsIds')
    .populate('userId')
    .populate('likes')
    .sort('-created_at')
    .exec(function(err, posts){ 
    if(req.user){
   var user = req.user;
    }else{
      var user = '';
    }
//console.log(posts);    
//res.send(posts);   
                  res.render('admin/community/postList.ejs', {
                title: 'Community Post List',
                 user :user,
                 post:posts,
                 timeAgo:timeAgo,
                message : req.flash("message"),
                error : req.flash('error')
            });
                  });
}

});
   });

 /*******delete Post********/
 /*
*
delete comment Post
*
*/
app.get('/deletComentPost', isLoggedIn, function(req, res) {
var commentId = req.param('id');
Post.findById(commentId, function(err, post){
console.log(post);
if(post.image){
var image = post.image;
 var data = image.toString().split(',');
var data = data.toString().split('["');
var data = data.toString().split('"]');
var data = data.toString().split('"');
var data = data.toString().split(',');
    each(data, function(el, next) {
 fs.unlink(desPost + '/' + el, (err) => {
      //  if (err) throw err;
      });
next();
    });
}

if(post.video && post.video != '[object FileReader]'){
var video = post.video;
 var data = video.toString().split(',');
var data = data.toString().split('["');
var data = data.toString().split('"]');
var data = data.toString().split('"');
var data = data.toString().split(',');
    each(data, function(el, next) {
 fs.unlink(desPost + '/' + el, (err) => {
      //  if (err) throw err;
      });
next();
    });
}


if(post.likes){
  var like = post.likes;
  if(like.length){
for(var j=0;j<like.length; j++) {
if(like[j]){
  var likeId = like[j];

 likes.findByIdAndRemove(likeId, function(err, removeLike) {
 if(err){
    res.send(err);
  }
 });
 } 
}
}
}
PostComment.find({'postId': commentId}, function(err, postCommt) {

if(postCommt){
if(postCommt.length){
for(var j=0;j<postCommt.length; j++) {
  if(postCommt[j].id){
  var id = postCommt[j].id;
PostComment.findByIdAndRemove(id, function(err, removeCom) {
  if(err){
   // res.send(err);
  }
 }); 
}
}
}
}
});
notification.find({'PostId':commentId}).exec( function (err, findNotictn){
if(findNotictn){
  if(findNotictn.length){
    for(var j=0;j<findNotictn.length; j++) {
  if(findNotictn[j].id){
  var id = findNotictn[j].id;

 notification.findByIdAndRemove(id, function(err, getOne) {
            if (err) {
                //res.send(err);
            } else {
            } 
          });
}
}
}
}
});


 Post.findByIdAndRemove(commentId, function(err, removePost) {
            if (err) {
               req.flash('error','Error, Please try again.');
      res.redirect('/post_List');
            } else {
              req.flash('message','Post has been delete successfully');
      res.redirect('/post_List');

          }
 
});
});
});




    /***********end of community*******/
    /************end of action **************/

    /************loggined check******/
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
    /************end of checking***/
}