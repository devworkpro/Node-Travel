/*
 * /lib/controller.js
 */
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var fpm = require('express-php-fpm');
var wordpress = require("wordpress");
var nodemailer = require("nodemailer");
var paypal = require('paypal-rest-sdk');
var each = require('async-each-series');
var async = require('async');
var sanitizeHtml = require('sanitize-html');
var twilio = require('twilio');


// Find your account sid and auth token in your Twilio account Console.
//var client = new twilio('AC358c2668bc501f3a42bffe75237c632c', '36dd165b40dd0e6b1d3bb9621a9a6462');
var client = new twilio('ACf6592165a3d95e39d6f120eb63a68730', '2828b3e7cd7765e7b853474ee65e6298');
// Send the text message.

module.exports = function(app, passport) {

    var includes = require('array-includes');

    var des = path.join(__dirname, '../public/uploads/blog');
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, des)
        },
        filename: function(req, file, cb) {
            cb(null, new Date() + '_' + file.originalname)
        }
    });
    var upload = multer({
        storage: storage
    });


    var desImg = path.join(__dirname, '../public/uploads/addBlog');
    var storagImg = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, desImg)
        },
        filename: function(req, file, cb) {
            cb(null, new Date() + '_' + file.originalname)
        }
    });
    var uploadIMg = multer({
        storage: storagImg
    });

    var dest = path.join(__dirname, '../public/uploads/images');
    var storag = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, dest)
        },
        filename: function(req, file, cb) {
            cb(null, new Date() + '_' + file.originalname)
        }
    });
    var uploaded = multer({
        storage: storag
    });

    var desPost = path.join(__dirname, '../public/uploads/post');
    var storagePost = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, desPost)
        },
        filename: function(req, file, cb) {
            cb(null, new Date() + '_' + file.originalname)
        }
    });
    var uploadPost = multer({
        storage: storagePost
    });

    /*
      Here we are configuring our SMTP Server details.
      STMP is mail server which is responsible for sending and recieving email.
    */
    var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'hansa.rexweb@gmail.com',
            pass: 'h@ns@th!'
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true
    });
    /*------------------SMTP Over-----------------------------*/
    var moment = require('moment');
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
    var notification = require('../app/models/notification');
    var timeAgo = require('node-time-ago');
    var Post = require('../app/models/post');
    var PostComment = require('../app/models/PostComment');
     var chat = require('../app/models/chat');

    /*
    *
    Upload only image and video
    *
    */



/*var CronJob = require('cron').CronJob;
new CronJob('* * * * * *', function() {

  var body = 'helloo';
            client.messages.create({
                to: '+16176334871',
                from: '+18572148374',
                body: body
            }, function(err, number) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(number);
                }
            });

  console.log('You will see this message every second');
}, null, true, 'Asia/Kolkata');
*/

 

    //var cron = require('node-cron');
    var CronJob = require('cron').CronJob;

     new CronJob('0 6 * * *', function() {
        console.log('immediately started');

        User.find({
            'local.role': {
                $ne: 'admin'
            }
        }).exec(function(err, users) {
            if (err) {
                //res.send(err);
            } else {
                if (users.length) {
                    each(users, function(user, next) {
                        if (user.local.from == 'local') {
                            var experiedPlan = user.local.PlanExpried_at;
                            var planId = user.local.plan_id,
                                user = user.local,
                                phone = user.phone;
                        } else {
                            var experiedPlan = user.facebook.PlanExpried_at;
                            var planId = user.facebook.plan_id,
                                user = user.facebook,
                                phone = user.phone;
                        }


                        if (new Date(experiedPlan).getTime() > new Date().getTime() || new Date(experiedPlan).getTime() === new Date().getTime() && planId) {
                            //FOR Video
                            var purchasePlan = user.plan_at;

                            var first = new Date(purchasePlan);
                            var second = new Date();
                            //Days
                            // Copy date parts of the timestamps, discarding the time parts.
                            var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
                            var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

                            // Do the math.
                            var millisecondsPerDay = 1000 * 60 * 60 * 24;
                            var millisBetween = two.getTime() - one.getTime();
                            var days = millisBetween / millisecondsPerDay;

                            // Round down.
                            var diffDays = Math.floor(days);



                            Video.find({
                                'WOD_plan': user.plan_id
                            }).count(function(error, count) {

                                console.log('count >>', count);
                                console.log('diffDays >>', diffDays);
                                if (diffDays < count || diffDays == '0') {

                                    if (diffDays == '0') {
                                        diffDays = 1;
                                    } else {
                                        diffDays = parseInt(diffDays) + parseInt(1);
                                    }
                                    if (diffDays) {

                                    } else {
                                        diffDays = 1;
                                    }
                                    Video.findOne({
                                        'WOD_plan': user.plan_id,
                                        'order': diffDays
                                    }).exec(function(err, WOD) {
                                      if(WOD){
                                        console.log(WOD);
                                        var title = WOD.video_title,
                                            logIn = '/login';

                                        // fullUrl = req.protocol + '://' + req.get('host') + logIn;
                                        //console.log(fullUrl);
                                        if (phone) {
                                            var body = 'Reminder message for workout.Your workout "' + title + '" is waiting for you.Thank You';
                                            client.messages.create({
                                                to: phone,
                                                from: '+18572148374',
                                                body: body
                                            }, function(err, number) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log(number);
                                                }
                                            });
                                        }
                                      }
                                    });
                                } else {
                                    var divid = diffDays / count;
                                    var cal = Math.floor(divid);
                                    console.log('cal >>', cal);
                                    Video.findOne({
                                        'WOD_plan': user.plan_id,
                                        'order': cal
                                    }).exec(function(err, WOD) {
                                        console.log(WOD);
                                        if(WOD){
                                        var title = WOD.video_title,
                                            logIn = '/login';
                                        //var fullUrl = req.protocol + '://' + req.get('host') + logIn,
                                        if (phone) {
                                            body = 'Reminder message for workout.Your workout "' + title + '" is waiting for you.Thank You';
                                            client.messages.create({
                                                to: phone,
                                                from: '+18572148374',
                                                body: body
                                            }, function(err, number) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log(number);
                                                }
                                            });
                                        }
                                      }
                                    });
                                }

                            });
                        }
                        next();
                    });
                }
            }
        });
     console.log('You will get message every day');
}, null, true, 'Asia/Kolkata');

//America/Los_Angeles
    app.post('/uploadImgVideo', uploadPost.any(), function(req, res) {
        res.send(req.files[0].filename);
    });

    app.post('/delVideo', function(req, res) {
        var oldFile = req.body.name;
        fs.unlink(desPost + '/' + oldFile, (err) => {
            if (err) throw err;
            // res.send(err);
        });
        res.send('yes');
    });


    app.post('/uploadImg', uploadIMg.any(), function(req, res) {
        var file = req.files[0].filename;
        res.send(file);
    });
    /*
    *
    User Dashboard
    *
    */
    app.get('/userDashboard', isLoggedIn, function(req, res) {


        /*var body = 'Reminder message for workout.Your workout is waiting for you.Thank You';
        client.messages.create({
          to: '+917355910653',
          from: '+18572148374',
          body: body
        },function(err, number) {
          if(err){
            console.log(err);
          }else{
        console.log(number);
        }
        });
        */

        if (req.session.passport) {

            req.session.passport.backUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            req.session.passport.urlId = req.user._id;
        }
        console.log(req.session.passport.backUrl);

        if (req.user.local.from == 'local' && req.user.local.role == 'user') {
            var planId = req.user.local.plan_id;
            var userId = req.user.id;

            videoRecord.find({
                'userId': userId
            }).populate('WOD_Id').sort('-created_at').exec(function(error, video) {
                
                var count = video.length;

                Plan.find({}).exec(function(err, plan) {
                    var level;
                    if (count == 0) {
                        level = 1;
                    } else if (count == 1 || count < 5) {
                        level = 1;
                    } else if (count == 5 || count < 10) {
                        level = 2;
                    } else if (count == 10 || count < 20) {
                        level = 3;
                    } else if (count == 20 || count < 30) {
                        level = 4;
                    } else if (count == 30 || count < 50) {
                        level = 5;
                    } else if (count == 50 || count > 50) {
                        level = 6;
                    }

                    res.render('user/userDashboard.ejs', {
                        layout: 'layouts/frontend.ejs',
                        title: 'User Dashboard',
                        user: req.user,
                        userSingle: req.user.local,
                        count: count,
                        WOD: video,
                        level: level,
                        Plan: plan,
                        moment: moment,
                        status: res.locals.login
                    });
                });
            });
        } else if (req.user.facebook.from == 'facebook' && req.user.facebook.role == 'user') {
            var planId = req.user.facebook.plan_id;
            var userId = req.user.id;

            videoRecord.find({
                'userId': userId
            }).populate('WOD_Id').sort('-created_at').exec(function(error, video) {
                count = video.length;

                Plan.find({}).exec(function(err, plan) {
                    var level;
                    if (count == 0) {
                        level = 1;
                    } else if (count == 1 || count < 5) {
                        level = 1;
                    } else if (count == 5 || count < 10) {
                        level = 2;
                    } else if (count == 10 || count < 20) {
                        level = 3;
                    } else if (count == 20 || count < 30) {
                        level = 4;
                    } else if (count == 30 || count < 50) {
                        level = 5;
                    } else if (count == 50 || count > 50) {
                        level = 6;
                    }


                    res.render('user/userDashboard.ejs', {
                        layout: 'layouts/frontend.ejs',
                        title: 'User Dashboard',
                        user: req.user,
                        userSingle: req.user.facebook,
                        count: count,
                        WOD: video,
                        level: level,
                        Plan: plan,
                        moment: moment,
                        status: res.locals.login
                    });
                });
            });
        } else {

            res.redirect('/dashboard');
        }

    });

    /*
     *
     Blog Section
     *
     */
    app.get('/blog', function(req, res) {

        blogPost.find({})
            .populate({
                path: 'commentsIds',
                options: {
                    sort: {
                        'order': 1
                    }
                }
            })
            // .populate('commentsIds')
            .populate('userId')
            .populate('likes').sort({
                created_at: -1
            }).limit(5)
            .exec(function(err, blog, count) {

                blogPost.find({})
                    .populate({
                        path: 'commentsIds',
                        options: {
                            sort: {
                                'order': 1
                            }
                        }
                    })
                    // .populate('commentsIds')
                    .populate('userId')
                    .populate('likes').sort({
                        created_at: -1
                    }).limit(10)
                    .exec(function(err, latested) {


                        if (req.user) {
                            var user = req.user;
                        } else {
                            var user = '';
                        }
                        //res.send(blog);

                        //res.send(blog);
                        res.render('user/blog.ejs', {
                            layout: 'layouts/frontend.ejs',
                            title: 'Blog',
                            user: user,
                            timeAgo: timeAgo,
                            latested: latested,
                            status: res.locals.login,
                            blog: blog,
                            message: req.flash('message')
                        });

                    });
            });
    });


    /***Load More Blog**/
    app.post('/loadMoreBlog', function(req, res) {
        var last = req.param('id');

        blogPost.find({
                '_id': {
                    $lt: last
                }
            })
            .populate({
                path: 'commentsIds',
                options: {
                    sort: {
                        'order': 1
                    }
                }
            })
            // .populate('commentsIds')
            .populate('userId')
            .populate('likes').sort({
                created_at: -1
            }).limit(5)
            .exec(function(err, blog) {

                if (blog.length > 0) {
                    if (req.user) {
                        var user = req.user;
                    } else {
                        var user = '';
                    }

                    res.render('user/element/loadMoreBlog.ejs', {
                        layout: false,
                        user: user,
                        blog: blog,
                        timeAgo: timeAgo
                    });
                } else {
                    res.send(false);
                }
            });
    });

    /********search blog *******/

    app.post('/searchBlog', function(req, res) {
        var val = req.body.keyword;

        console.log(val)
        blogPost.find({
                'title': {
                    $regex: '.*' + val + '.*'
                }
            })
            .exec(function(err, blog) {

                if (blog.length) {
                    JSON.stringify(blog);
                    res.render('user/element/searchBlog.ejs', {
                        layout: false,
                        status: res.locals.login,
                        blog: blog,
                    });
                } else {
                    res.send('No result Found');
                }

            });
    });
    /*****show single blog****/

    app.get('/readBlog', function(req, res) {

        var blogId = req.param('id');

        var not = req.param('noty');
        if (not) {
            if (req.user) {
                notification.findById(not, function(err, doc) {
                    if (doc) {
                        var findN = doc.status;
                        if (findN.length) {
                            for (var i = 0; i < findN.length; i++) {

                                if (findN[i] == req.user.id) {
                                    findN.splice(i, 1);

                                }
                            }
                            notification.findByIdAndUpdate(not, {
                                'status': findN
                            }, function(err, place) {

                            });
                        }
                    }
                });
            }
        }

        blogPost.find({
                '_id': blogId
            })
            .populate({
                path: 'commentsIds',
                options: {
                    sort: {
                        'order': 1
                    }
                },
                populate: {
                    path: 'userId'
                }
            })

            .populate('userId')
            .populate('likes')
            .exec(function(err, blog, count) {
                if (req.user) {
                    var user = req.user;
                } else {
                    var user = '';
                }

                blogPost.find({})
                    .populate({
                        path: 'commentsIds',
                        options: {
                            sort: {
                                'order': 1
                            }
                        }
                    })
                    .populate('userId')
                    .populate('likes').sort({
                        created_at: -1
                    }).limit(10)
                    .exec(function(err, latested) {

                        res.render('user/singleBlog.ejs', {
                            layout: 'layouts/frontend.ejs',
                            title: 'Blog',
                            user: user,
                            moment: moment,
                            latested: latested,
                            status: res.locals.login,
                            blog: blog,
                            timeAgo: timeAgo,
                            message: req.flash('message')
                        });

                    });
            });



    });
    /****Like Blog/comment***/

    app.post('/likeBlog', isLoggedIn, function(req, res) {
        JSON.stringify(req.body);

        User.findOne({
            'local.role': 'admin'
        }).exec(function(err, admin) {

            var adj = [];
            adj.push(admin.id);
            var blogId = req.body.ids;
            var likeSave = new likes();

            likeSave.userId = req.user.id;
            likeSave.blogId = req.body.ids;
            likeSave.type = req.body.type;
            likeSave.created_at = new Date();
            likeSave.updated_at = new Date();
            likeSave.action = '1';

            likeSave.save(function(err, data) {
                if (err) {

                    res.send('err');
                } else {
                    /*******get total likes*********/
                    blogPost.findOne({
                        '_id': blogId
                    }).exec(function(err, getBlog) {
                        var likes = getBlog.likes;
                        if (likes.length) {

                            JSON.stringify(likes);
                            var upComment = likes;
                            upComment.push(data._id);
                            JSON.stringify(upComment);
                        } else {
                            var upComment = [];
                            upComment.push(data._id);

                            JSON.stringify(upComment);
                        }
                        blogPost.findByIdAndUpdate(blogId, {
                            'likes': upComment
                        }, function(err, place) {

                            var notificatn = new notification();

                            notificatn.userId = req.user.id;
                            notificatn.likeId = data._id;
                            notificatn.blogId = blogId;
                            notificatn.type = 'Like blog';
                            notificatn.created_at = new Date();
                            notificatn.updated_at = new Date();
                            notificatn.status = adj;
                            notificatn.UserRecord = adj;
                            notificatn.save(function(err, res) {
                                if (err) {

                                    res.json('err');
                                } else {


                                }
                            });

                            res.json(upComment.length);

                        });

                    });

                    /*********end of total like*********/

                }

            });

        });
    });
    /********dislike**********/
    app.post('/dislikeBlog', isLoggedIn, function(req, res) {
        var blogId = req.body.ids;
        likes.findOne({
            'userId': req.user.id,
            'blogId': req.body.ids,
            'type': 'blog'
        }).exec(function(err, liked) {
            var likeId = liked.id;

            likes.findByIdAndRemove(likeId, function(err, place) {
                if (err) {
                    res.send(err);
                } else {
                    /*******get total likes*********/
                    blogPost.findOne({
                        '_id': blogId
                    }).exec(function(err, getBlog) {
                        var likes = getBlog.likes;
                        if (likes.length > 0) {

                            JSON.stringify(likes);

                            for (var i = 0; i < likes.length; i++) {

                                if (likes[i] == likeId) {

                                    likes.splice(i, 1);

                                }
                            }


                            blogPost.findByIdAndUpdate(blogId, {
                                'likes': likes
                            }, function(err, place) {


                                notification.findOne({
                                    'blogId': blogId,
                                    'type': 'Like Blog'
                                }).exec(function(err, findNotictn) {
                                    if (findNotictn) {
                                        notification.findByIdAndRemove(findNotictn.id, function(err, getOne) {
                                            if (err) {
                                                //res.send(err);
                                            } else {}

                                        });
                                    }

                                });

                                if (likes) {
                                    if (likes.length) {
                                        console.log(likes.length);
                                        console.log('likes');
                                        var lengh = likes.length;
                                        // JSON.stringify(lengh);    
                                        res.json(lengh);

                                    } else {
                                        res.json('0');
                                    }
                                } else {
                                    res.json('0');
                                }


                            });

                        } else {
                            res.json('0');
                        }


                    });
                    /*********end of total like*********/



                }
            });

        });
    });

    /********************Comment Save ***********/
    app.post('/sendCommentInDb', isLoggedIn, uploaded.any(), function(req, res) {


        var commentSave = new commentBlog();

        var blogIds = req.body.blogId;
        if (req.body.commtId) {
            commentSave.commtId = req.body.commtId;
        }

        commentSave.userId = req.user.id;
        commentSave.message = req.body.field;
        commentSave.blogId = req.body.blogId;
        commentSave.type = req.body.type;


        commentSave.order = req.body.order;
        commentSave.parentId = req.body.parentId;
        commentSave.created_at = new Date();
        commentSave.updated_at = new Date();

        commentSave.save(function(err, data) {
            if (err) {

                // console.log(commentSave);
                // res.send('err');
            } else {
                blogPost.findOne({
                    '_id': blogIds
                }).exec(function(err, getBlog) {
                    var commentId = getBlog.commentsIds;
                    if (commentId.length) {

                        JSON.stringify(commentId);
                        var upComment = commentId;
                        upComment.push(data._id);
                        JSON.stringify(upComment);
                    } else {
                        var upComment = [];
                        upComment.push(data._id);

                        JSON.stringify(upComment);
                    }
                    blogPost.findByIdAndUpdate(blogIds, {
                        'commentsIds': upComment
                    }, function(err, place) {
                        commentBlog.findOne({
                            '_id': data.id
                        }).populate('userId').exec(function(err, getComment) {
                            JSON.stringify(getComment);
                            //  res.send(getComment);

                            commentBlog.find({
                                'blogId': blogIds
                            }).exec(function(err, allCmt) {
                                var adj = [];
                                User.findOne({
                                    'local.role': 'admin'
                                }).exec(function(err, admin) {


                                    if (allCmt) {
                                        adj.push(admin.id);
                                        for (var i = 0; i < allCmt.length; i++) {
                                            var us = allCmt[i].userId;

                                            var userRe = includes(adj, us);
                                            console.log(userRe);
                                            if (userRe == true) {} else {
                                                adj.push(us);
                                            }
                                        }
                                    }
                                    var notificatn = new notification();

                                    notificatn.userId = req.user.id;
                                    notificatn.blogId = req.body.blogId;
                                    notificatn.type = req.body.type;
                                    notificatn.created_at = new Date();
                                    notificatn.commentId = data._id;
                                    notificatn.updated_at = new Date();
                                    notificatn.status = adj;
                                    notificatn.UserRecord = adj;


                                    notificatn.save(function(err, res) {
                                        if (err) {

                                            //  res.send('err');
                                        } else {


                                        }
                                    });

                                    res.render('user/element/comment.ejs', {
                                        layout: false,
                                        data: getComment,
                                        type: req.body.type,
                                        timeAgo: timeAgo

                                    });


                                });

                            });

                        });


                    });

                });
            };

        });
    });

    /** show blog according to tag**/
    app.get('/tag', function(req, res) {
        var val = req.param('tags');
        blogPost.find({
                'tags': {
                    $regex: '.*' + val + '.*'
                }
            })
            .exec(function(err, blogs) {

                if (req.user) {
                    var user = req.user;
                } else {
                    var user = '';
                }

                blogPost.find({})
                    .populate({
                        path: 'commentsIds',
                        options: {
                            sort: {
                                'order': 1
                            }
                        }
                    })
                    // .populate('commentsIds')
                    .populate('userId')
                    .populate('likes').sort({
                        created_at: -1
                    }).limit(5)
                    .exec(function(err, latested) {

                        res.render('user/tagBlog.ejs', {
                            layout: 'layouts/frontend.ejs',
                            title: 'Blog',
                            user: user,
                            val: val,
                            timeAgo: timeAgo,
                            moment: moment,
                            latested: latested,
                            status: res.locals.login,
                            blog: blogs,
                            message: req.flash('message')
                        });
                    });
            });
    });


    /***Load More Comment Post**/
    app.post('/loadBlogTag', function(req, res) {
        var last = req.param('id');
        var val = req.param('val');
        blogPost.find({
                $and: [{
                    'tags': {
                        $regex: '.*' + val + '.*'
                    }
                }, {
                    '_id': {
                        $lt: last
                    }
                }]
            }).limit(5)
            .exec(function(err, blogs) {

                if (blogs.length > 0) {

                    JSON.stringify(blogs);
                    if (req.user) {
                        var user = req.user;
                    } else {
                        var user = '';
                    }
                    res.render('user/element/loadBlogTag.ejs', {
                        layout: false,
                        user: user,
                        blog: blogs,
                        timeAgo: timeAgo
                    });
                } else {
                    res.send(false);
                }
            });
    });

    /********end of blog*********/
    /*
    *
    Video library
    *
    *
    */

    /***************Video Library Page**********/
    app.get('/video_library', isLoggedIn, function(req, res) {
        //console.log(res.locals.login);
        Video.find({
            'video_Category': 'Video Library'
        }, function(err, wod) {
            res.render('user/videoLibrary.ejs', {
                layout: 'layouts/frontend.ejs',
                title: 'video Library',
                user: req.user,
                workouts: wod,
                status: res.locals.login
            });
        });

    });
    /*
     *
     *Daily WorkOut
     *
     *
     */
    app.get('/dailyWorkOut', isLoggedIn, function(req, res) {

        if (req.user.local.from == 'local') {
            var user = req.user.local;

        } else {
            var user = req.user.facebook;
        }
        /*********Daily WOD*********/
        var purchasePlan = user.plan_at;
        var first = new Date(purchasePlan);
        var second = new Date();
        //Days
        // Copy date parts of the timestamps, discarding the time parts.
        var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

        // Do the math.
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = two.getTime() - one.getTime();
        var days = millisBetween / millisecondsPerDay;

        // Round down.
        var diffDays = Math.floor(days);


        console.log(diffDays);

        Video.find({
            'WOD_plan': user.plan_id
        }).count(function(error, count) {


            if (diffDays < count || diffDays == '0') {

                if (diffDays == '0') {
                    diffDays = 1;
                } else {
                    diffDays = parseInt(diffDays) + parseInt(1);
                }
                if (diffDays) {

                } else {
                    diffDays = 1;
                }
                Video.findOne({
                    'WOD_plan': user.plan_id,
                    'order': diffDays
                }).exec(function(err, WOD) {
                    JSON.stringify(WOD);
                    console.log(WOD);
                    res.render('user/dailyWorkOut.ejs', {
                        layout: 'layouts/frontend.ejs',
                        title: 'Daily WOD',
                        user: req.user,
                        sanitizeHtml:sanitizeHtml,
                        workouts: WOD,
                        status: res.locals.login,
                        message: req.flash('message')
                    });

                });
            } else {

                var divid = diffDays / count;
                var cal = Math.floor(divid);
                console.log(cal);
                Video.findOne({
                    'WOD_plan': user.plan_id,
                    'order': cal
                }).exec(function(err, WOD) {

                    console.log(WOD);
                    JSON.stringify(WOD);
                    console.log(WOD);
                    res.render('user/dailyWorkOut.ejs', {
                        layout: 'layouts/frontend.ejs',
                        title: 'Daily WOD',
                        sanitizeHtml:sanitizeHtml,
                        user: req.user,
                        workouts: WOD,
                        status: res.locals.login,
                        message: req.flash('message')
                    });

                });
            }
        });
        /*********Daily WOD*********/
    });

    /**********workout on your way*******/
    app.get('/travelWorkOut', isLoggedIn, function(req, res) {

        if (req.user.local.from == 'local') {
            var user = req.user.local;

        } else {
            var user = req.user.facebook;
        }
        /*********Travel WOD on Your way*********/
        var planId = user.plan_id;
        Video.find({
            'WOD_plan': planId
        }).sort('order').exec(function(err, WOD) {
            console.log(WOD);
            JSON.stringify(WOD);
            res.render('user/videoLibrary.ejs', {
                layout: 'layouts/frontend.ejs',
                title: 'Travel WOD on Your way',
                user: req.user,
                 sanitizeHtml : sanitizeHtml,
                workouts: WOD,
                status: res.locals.login,
                message: req.flash('message')
            });

        });
        /*********end  of Travel WOD on Your way*********/
    });


    /*******end of section******/
    /************WOrkout time save******/
    app.post('/recordSave', isLoggedIn, function(req, res) {
        var data = req.body;
        var time_spend = data.duration;
        var WOD_Id = data.WOD_Id;

        videoRecord.find({
            'WOD_Id': WOD_Id,
            'userId': req.user.id
        }).sort('-created_at').limit(1).exec(function(err, getted) {

            if (getted.length) {

                console.log(getted[0].created_at);
                var first = new Date(getted[0].created_at);
                var second = new Date();

                // Copy date parts of the timestamps, discarding the time parts.
                var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
                var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

                // Do the math.
                var millisecondsPerDay = 1000 * 60 * 60 * 24;
                var millisBetween = two.getTime() - one.getTime();
                var days = millisBetween / millisecondsPerDay;
                // Round down.
                var diffDays = Math.floor(days);



                if (diffDays == 0) {

                    videoRecord.findByIdAndUpdate(getted[0].id, {
                        'time': time_spend,
                        'updated_at': new Date()
                    }, function(err, place) {
                        // req.flash('message', 'Time update successfully');
                        res.send('Time Save successfully');

                    });
                } else {
                    var record = videoRecord();
                    record.WOD_Id = WOD_Id;
                    record.time = time_spend;
                    record.total = req.body.total;
                    record.userId = req.user.id;
                    record.updated_at = new Date();
                    record.created_at = new Date();
                    record.save(function(err, data) {
                        if (err) {
                            //  req.flash('message', 'ERROR, Not submit');
                            //res.redirect('back');
                            res.send('ERROR, Not submit');
                        } else {
                            // req.flash('message', 'Time Save successfully');
                            // res.redirect('back');
                            res.send('Time Save successfully');
                        }

                    });
                }
            } else {
                var record = videoRecord();

                record.WOD_Id = WOD_Id;
                record.time = time_spend;
                record.userId = req.user.id;
                record.total = req.body.total;
                record.updated_at = new Date();
                record.created_at = new Date();
                record.save(function(err, data) {

                    if (err) {
                        //  req.flash('message', 'ERROR, Not submit');
                        // res.redirect('back');
                        res.send('ERROR, Not submit');

                    } else {
                        //  req.flash('message', 'Time Save successfully');
                        //res.redirect('back');
                        res.send('Time Save successfully');
                    }

                });
            }
        });
    });

    /****show single WOD*****/
    app.get('/workOut', isLoggedIn, function(req, res) {
        var wodId = req.param('id');

        Video.findOne({
            '_id': wodId
        }).exec(function(err, WOD) {

            res.render('user/singleWorkOut.ejs', {
                layout: 'layouts/frontend.ejs',
                title: 'Travel WOD on Your way',
                user: req.user,
                workouts: WOD,
                sanitizeHtml:sanitizeHtml,
                status: res.locals.login,
                message: req.flash('message')
            });

        });
    });

    /*
    *
    *
    Contact
    *
    */
    /******* contact***/

    app.get('/contactUs', function(req, res) {

        res.render('user/contact.ejs', {
            layout: 'layouts/frontend.ejs',
            title: 'Contact Us',
            user: req.user,
            status: res.locals.login,
            message: req.flash('message')
        });


    });

    app.post('/contact', function(req, res) {

        User.findOne({
            'local.role': 'admin'
        }, function(err, user) {
            //console.log(user.local.email);

            var mailOptions = {

                from: req.body.senderName + '<' + req.body.senderEmail + '>',
                to: 'ravinder92.rexweb@gmail.com',
                subject: req.body.subject,
                text: req.body.message + '\n send By ' + req.body.senderEmail
            }
            //console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    ///console.log(error);
                } else {

                    var contact = new Contact();
                    contact.senderName = req.body.senderName;
                    contact.senderEmail = req.body.senderEmail;
                    contact.reciver = req.body.reciver;
                    contact.subject = req.body.subject;
                    contact.message = req.body.message;



                    contact.save(function(err, data) {
                        if (err) {
                            req.flash('message', 'ERROR, mail is not send');
                            res.redirect('/contactUs');

                        } else {

                            //  console.log(response);
                            //    console.log("Message sent: " + response.messageId);


                            req.flash('message', 'Mail send Successfully');
                            res.redirect('/contactUs');
                        }
                    });
                }
            });
        });
    });

    /*
    *
    Update User info 
    *
    */

/*
http://thenodeway.io/posts/understanding-error-first-callbacks/
*/
async.parallel({
    one: function(callback){
        setTimeout(function(){
            callback(null, 1);
        }, 200);
    },
    two: function(callback){
        setTimeout(function(){
            callback(null, 2);
        }, 100);
    }
},
function(err, results) {
    // results is equal to: {one: 1, two: 2}
});


    app.post('/updateUser', isLoggedIn, function(req, res) {
     
        var obj = {};
        //JSON.stringify(req.body);
        var attr = req.body.attr;
        var val = req.body.val;
        var usrId = req.body.userId;
        var from = req.body.from;
        console.log(from);
        if (from != 'facebook') {


            if (attr == 'user_name') {
                User.findOne({
                    'local.user_name': val,
                    '_id': {
                        '$ne': usrId
                    }
                }).exec(function(err, doc) {
                    console.log(doc);
                    if (doc) {
                        obj.type = 'err';
                        obj.msg = 'user name already exist.';
                        JSON.stringify(obj);
                        res.send(obj);
                    } else {
                        User.findByIdAndUpdate(req.user.id, {
                            'local.user_name': val,
                            'local.updated_at': new Date()
                        }, function(err, place) {

                            obj.type = 'success';
                            obj.msg = 'User Name Successfully update.';
                            JSON.stringify(obj);
                            res.send(obj);

                        });
                    }
                });

            } else if (attr == 'first_name') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.first_name': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'First Name Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'last_name') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.last_name': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Last Name Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'email') {
                User.findOne({
                    'local.email': val,
                    '_id': {
                        '$ne': usrId
                    }
                }).exec(function(err, doc) {
                    console.log(doc);

                    if (doc) {
                        obj.type = 'error';
                        obj.msg = 'Email already exist.';
                        JSON.stringify(obj);
                        res.send(obj);


                    } else {
                        User.findByIdAndUpdate(req.user.id, {
                            'local.email': val,
                            'local.updated_at': new Date()
                        }, function(err, place) {

                            obj.type = 'success';
                            obj.msg = 'Email Successfully update.';
                            JSON.stringify(obj);
                            res.send(obj);

                        });
                    }
                });

            } else if (attr == 'phone') {
                var country = req.body.country;
                //+18572148374

                var random = Math.floor(10000 + Math.random() * 90000);
                console.log(random);

                var body = 'Your verfication code is: ' + random;
                client.messages.create({
                    to: val,
                    from: '+18572148374',
                    body: body
                }, function(err, number) {
                    if(err){
                      var obj={};
                       obj.type = 'err';
                         obj.msg = 'Number is not valid';
                        JSON.stringify(obj);
                        res.send(obj);
  }else{
                    

                    User.findByIdAndUpdate(req.user.id, {
                        'local.phone': '',
                        'local.country': '',
                        'local.code': random,
                        'local.updated_at': new Date()
                    }, function(err, place) {
                      console.log(place);
                      var obj ={};
                        obj.type = 'success';
                        // obj.msg = 'Phone successfully Updated.'
                        JSON.stringify(obj);
                        res.send(obj);

                    });
                      }
                });


            } else if (attr == 'waist') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.waist': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Waist Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'fitness') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.fitness': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Fitness Level Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'goal') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.goal': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Goal Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'WOD_routine') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.WOD_routine': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'WOD Routine Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'weight') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.weight': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Weight Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'height') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.height': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Height Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'age') {
                User.findByIdAndUpdate(req.user.id, {
                    'local.age': val,
                    'local.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Age Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            }
        } else {

            if (attr == 'user_name') {
                User.findOne({
                    'local.user_name': val,
                    '_id': {
                        '$ne': usrId
                    }
                }).exec(function(err, doc) {
                    if (doc) {
                        obj.type = 'err';
                        obj.msg = 'user name already exist.';
                        JSON.stringify(obj);
                        res.send(obj);
                    } else {
                        User.findByIdAndUpdate(req.user.id, {
                            'facebook.user_name': val,
                            'facebook.updated_at': new Date()
                        }, function(err, place) {

                            obj.type = 'success';
                            obj.msg = 'User Name Successfully update.';
                            JSON.stringify(obj);
                            res.send(obj);

                        });
                    }
                });

            } else if (attr == 'first_name') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.first_name': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'First Name Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'last_name') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.last_name': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Last Name Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'email') {
                User.findOne({
                    $and: [{
                        '_id': {
                            '$ne': usrId
                        }
                    }, {
                        $or: [{
                                'local.email': val
                            },
                            {
                                'facebook.email': val
                            }
                        ]
                    }]
                }).exec(function(err, doc) {

                    if (doc) {
                        obj.type = 'error';
                        obj.msg = 'Email already exist.';
                        JSON.stringify(obj);
                        res.send(obj);


                    } else {
                        User.findByIdAndUpdate(req.user.id, {
                            'facebook.email': val,
                            'facebook.updated_at': new Date()
                        }, function(err, place) {

                            obj.type = 'success';
                            obj.msg = 'Email Successfully update.';
                            JSON.stringify(obj);
                            res.send(obj);

                        });
                    }
                });

            } else if (attr == 'phone') {
                var country = req.body.country;
                //+18572148374

                var random = Math.floor(10000 + Math.random() * 90000);
                console.log(random);

                var body = 'Your verfication code is: ' + random;
                client.messages.create({
                    to: val,
                    from: '+18572148374',
                    body: body
                }, function(err, number) {
                    if(err){
                       obj.type = 'err';
                         obj.msg = 'Number is not valid';
                        JSON.stringify(obj);
                        res.send(obj);
                     }else{
                    console.log('send now');

                    User.findByIdAndUpdate(req.user.id, {
                        'facebook.phone': '',
                        'facebook.country': '',
                        'facebook.code': random,
                        'facebook.updated_at': new Date()
                    }, function(err, place) {
                        obj.type = 'success';
                        // obj.msg = 'Phone successfully Updated.'
                        JSON.stringify(obj);
                        res.send(obj);

                    });
                      }
                });

                /* else if (attr == 'phone') {
                              var country = req.body.country;
                                User.findByIdAndUpdate(req.user.id, {
                                    'facebook.phone': val,
                                    'facebook.country': country,
                                    'facebook.updated_at': new Date()
                                }, function(err, place) {
                                    obj.type = 'success';
                                    obj.msg = 'Phone NUmber Successfully update.';
                                    JSON.stringify(obj);
                                    res.send(obj);

                                });

                            }*/

            } else if (attr == 'waist') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.waist': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Waist Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'fitness') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.fitness': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Fitness Level Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'goal') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.goal': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Goal Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'WOD_routine') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.WOD_routine': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'WOD Routine Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'weight') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.weight': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Weight Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'height') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.height': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Height Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            } else if (attr == 'age') {
                User.findByIdAndUpdate(req.user.id, {
                    'facebook.age': val,
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    obj.type = 'success';
                    obj.msg = 'Age Successfully update.';
                    JSON.stringify(obj);
                    res.send(obj);

                });

            }



        }
    });

    /*******Resend Code*********/
    app.post('/sendCodeAgain', function(req, res) {

        var random = Math.floor(10000 + Math.random() * 90000);

        var body = 'Your verfication code is: ' + random;
        client.messages.create({
            to: req.body.val,
            from: '+18572148374',
            body: body
        }, function(err, number) {
             if(err){
            console.log(err);
            res.send('Number is not valid');
  }else{

            if (req.body.from == 'local') {

                User.findByIdAndUpdate(req.body.userId, {
                    'local.code': random,
                     'local.phone': '',
                    'local.updated_at': new Date()
                }, function(err, place) {
                    var obj = {};
                    obj.type = 'success';
                    obj.msg = 'A New code has been send on your Phone.'
                    JSON.stringify(obj);
                    res.send(obj);

                });
            } else {
                User.findByIdAndUpdate(req.body.userId, {
                    'facebook.code': random,
                     'facebook.phone': '',
                    'facebook.updated_at': new Date()
                }, function(err, place) {
                    var obj = {};
                    obj.type = 'success';
                    obj.msg = 'A New code has been send on your Phone.'
                    JSON.stringify(obj);
                    res.send(obj);

                });
            }
             }
        });
    });

    /**********VERIFY CODE********/
    app.post('/VerifyCode', function(req, res) {

      async.auto({       

       VerifyCode: function(callback) {
       let projectDataINfo;
        var obj = {};
        console.log(req.body.code);

        if (req.body.code) {

            if (req.body.from == 'local') {
                console.log(req.body);
                User.findOne({
                    $and: [{
                        '_id': req.body.userId
                    }, {
                        'local.code': req.body.code
                    }]
                }).exec(function(err, user) {
                  console.log('mila >>',user);
                    if (user) {
                        console.log(user);
                        User.findByIdAndUpdate(req.body.userId, {
                            'local.country': req.body.countryName,
                            'local.phone': req.body.val,
                            'local.updated_at': new Date()
                        }, function(err, place) {
                            if (err) {
                                res.send('err');
                            } else {
                              console.log('success');
                                obj.type = 'success';
                                obj.msg = 'Phone Number has been verified.Thank You!'
                                JSON.stringify(obj);
                                res.send(obj);
                            }
                        });

                    } else {
                        obj.type = 'error';
                        obj.msg = 'Invalid Code'
                        JSON.stringify(obj);
                        res.send(obj);
                    }
                });
            } else {
                User.findOne({
                    $and: [{
                        '_id': req.body.userId
                    }, {
                        'facebook.code': req.body.code
                    }]
                }).exec(function(err, user) {
                    if (user) {

                        User.findByIdAndUpdate(req.body.userId, {
                            'facebook.country': req.body.countryName,
                            'facebook.phone': req.body.val,
                            'facebook.updated_at': new Date()
                        }, function(err, place) {
                            obj.type = 'success';
                            obj.msg = 'Phone Number has been verified.Thank You!'
                            JSON.stringify(obj);
                            res.send(obj);

                        });

                    } else {
                        obj.type = 'error';
                        obj.msg = 'Invalid Code'
                        JSON.stringify(obj);
                        res.send(obj);
                    }
                });
            }
        } else {

            obj.type = 'error';
            obj.msg = 'Session has been destroy.'
            JSON.stringify(obj);
            res.send(obj);
        }
         callback(projectDataINfo, 'helllo'); 
      },  

      abc: ['VerifyCode', function(projectDataINfo, callback) { 
                     console.log("results", projectDataINfo) 
  console.log('in make_folder', JSON.stringify(projectDataINfo));
              // async code to create a directory to store a file in  
                        // this is run at the same time as getting the data  
                 callback(null, 'folder');  
                                        }],
    });
    });

    /*********destroy Code*******/
    app.post('/destroyCode', function(req, res) {

     async.auto({       

       destroyCode: function(callback) {
       let destroyDataINfo;

        var obj = {};
        if (req.body.from == 'local') {
            User.findByIdAndUpdate(req.body.userId, {
                'local.code': '',
                'local.updated_at': new Date()
            }, function(err, place) {
                obj.type = 'success';
                obj.msg = ''
                JSON.stringify(obj);
                res.send(obj);

            });
        } else {
            User.findByIdAndUpdate(req.body.userId, {
                'facebook.code': '',
                'facebook.updated_at': new Date()
            }, function(err, place) {
                obj.type = 'success';
                obj.msg = ''
                JSON.stringify(obj);
                res.send(obj);

            });
        }

         callback(destroyDataINfo, 'haye'); 
      },  

      abc: ['destroyCode', function(destroyDataINfo, callback) { 
                     console.log("results", destroyDataINfo) 
  console.log('in make_folder', JSON.stringify(destroyDataINfo));
              // async code to create a directory to store a file in  
                        // this is run at the same time as getting the data  
                 callback(null, 'folder');  
                                        }],
    });

    });

    /************PLan for facebook user *******/

    app.post('/findPlans', isLoggedIn, function(req, res) {

        Plan.find({}).exec(function(err, plan) {

            JSON.stringify(plan);

            res.send(plan);
        });

    });
    app.post('/postPlan', isLoggedIn, function(req, res) {

        req.session.logUser = req.user._id;
        req.session.planTaken = req.body.package;
        if (req.session.planTaken) {
            Plan.findOne({
                '_id': req.body.package
            }).exec(function(err, plan) {
                if (plan.plan_duration == '1 Week') {
                    var firstDay = new Date();
                    var expriedDate = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
                } else if (plan.plan_duration == '3 Month') {

                    var x = 3;

                    var expriedDate = new Date();
                    expriedDate.setMonth(expriedDate.getMonth() + x);
                } else if (plan.plan_duration == '6 Month') {
                    var x = 6;

                    var expriedDate = new Date();
                    expriedDate.setMonth(expriedDate.getMonth() + x);
                }


                if (req.user.local.from == 'local') {


                    User.findByIdAndUpdate(req.user._id, {
                        'local.plan_id': req.body.package,
                        // 'local.WOD_routine': req.body.WOD_routine,
                        'local.updated_at': new Date(),
                        'local.plan_at': new Date(),
                        'local.PayComplete': 'no',
                        'local.PlanExpried_at': expriedDate
                    }, function(err, place) {

                        res.redirect('/payMOney');

                    });
                } else {
                    User.findByIdAndUpdate(req.user._id, {
                        'facebook.plan_id': req.body.package,
                        // 'facebook.WOD_routine': req.body.WOD_routine,
                        'facebook.updated_at': new Date(),
                        'facebook.plan_at': new Date(),
                        'facebook.PayComplete': 'no',
                        'facebook.PlanExpried_at': expriedDate
                    }, function(err, place) {

                        res.redirect('/payMOney');

                    });

                }



            });
        }
    });

    app.get('/payMOney', isLoggedIn, function(req, res) {

        var package = req.session.planTaken;

        Plan.findOne({
            '_id': package
        }).exec(function(err, plan) {

            if (plan.price !== '0') {

                var SUCC = req.protocol + '://' + req.get('host') + '/successPay';
                var CANC = req.protocol + '://' + req.get('host') + '/cancelPay';
                $price = plan.price;
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
                paypal.payment.create(payment, function(error, payment) {
                    if (error) {
                        console.log(error);
                    } else {

                        if (payment.payer.payment_method === 'paypal') {
                            //  req.paymentId = payment.id;
                            req.session.paymentId = payment.id;
                            var redirectUrl;
                            //console.log(payment.id);
                            //console.log(payment);
                            for (var i = 0; i < payment.links.length; i++) {
                                var link = payment.links[i];
                                console.log(link);
                                if (link.method === 'REDIRECT') {
                                    redirectUrl = link.href;
                                    console.log(redirectUrl);
                                }
                            }
                            res.redirect(redirectUrl);
                        }
                    }
                });
            } else {
                req.flash('message', 'Plan has been saved.');
                //('Plan successfully choosen');
                return res.redirect('back');
            }
        });
    });

    app.get('/successPay', function(req, res) {

        var package = req.session.planTaken;
        Plan.findOne({
            '_id': package
        }).exec(function(err, plan) {
            if (plan) {
                var payDetails = new Payment();
                payDetails.userId = req.session.logUser;
                payDetails.packageId = package;
                payDetails.amount = plan.price;
                payDetails.currency = plan.currency;
                payDetails.duration = plan.plan_duration;
                payDetails.paymentId = req.session.paymentId;
                payDetails.created_at = new Date();
                payDetails.updated_at = new Date();



                payDetails.save(function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {

                        videoRecord.find({
                            'userId': req.session.logUser
                        }).exec(function(err, place) {
                            if (place) {
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


                        Plan.findOne({
                            '_id': package
                        }).exec(function(err, plan) {
                            if (plan.plan_duration == '1 Week') {
                                var firstDay = new Date();
                                var expriedDate = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
                            } else if (plan.plan_duration == '3 Month') {

                                var x = 3;

                                var expriedDate = new Date();
                                expriedDate.setMonth(expriedDate.getMonth() + x);
                            } else if (plan.plan_duration == '6 Month') {
                                var x = 6;

                                var expriedDate = new Date();
                                expriedDate.setMonth(expriedDate.getMonth() + x);
                            }

                            if (req.user.local.from == 'local') {

                                User.findByIdAndUpdate(req.session.logUser, {
                                    'local.PayComplete': 'yes',
                                    'local.PlanExpried_at': expriedDate

                                }, function(err, place) {

                                    req.flash("message", 'Payment successfully submit.');
                                    res.render('user/success.ejs', {
                                        layout: 'layouts/frontend.ejs',
                                        title: 'Success',
                                        payDetails: data,
                                        status: res.locals.login,
                                        message: req.flash("message"),
                                        user: req.user
                                    });
                                    //res.redirect('/dashboard');
                                });




                            } else {

                                User.findByIdAndUpdate(req.session.logUser, {
                                    'facebook.PayComplete': 'yes',
                                    'facebook.PlanExpried_at': expriedDate
                                }, function(err, place) {

                                    req.flash("message", 'Payment successfully submit.');
                                    res.render('user/success.ejs', {
                                        layout: 'layouts/frontend.ejs',
                                        title: 'Success',
                                        payDetails: data,
                                        user: req.user,
                                        status: res.locals.login,
                                        message: req.flash("message")
                                    });
                                    // res.redirect('/dashboard');

                                });




                            }
                        });
                    }

                });
            }
        });


    });


    app.get('/cancelPay', function(req, res) {
        req.flash("message", 'Payment canceled successfully.');

        res.render('user/cancel.ejs', {
            layout: 'layouts/frontend.ejs',
            title: 'Cancel',
            status: res.locals.login,
            user: req.user,
            message: req.flash("message")
        });

    });


    /*********change plan***********/


    app.post('/checkPayment', isLoggedIn, function(req, res) {
        var obj = {};
        if (req.user.local.from === 'local' && req.user.local.role === 'user') {

            Payment.findOne({
                'userId': req.user._id,
                'packageId': req.user.local.plan_id
            }).sort('-created_at').exec(function(err, payment) {

                if (!payment) {
                    Plan.findOne({
                        '_id': req.user.local.plan_id
                    }).exec(function(err, plan) {

                        if (plan) {

                            if (plan.plan_name !== 'Free Trial') {
                                obj.plan = plan;
                                Plan.find({}).exec(function(err, allPlan) {

                                    obj.allPlan = allPlan;
                                    JSON.stringify(obj);
                                    res.send(obj);

                                });

                            }

                        }
                    });

                }
            });

        } else if (req.user.facebook.from === 'facebook' && req.user.facebook.role === 'user') {


            Payment.findOne({
                'userId': req.user._id,
                'packageId': req.user.facebook.plan_id
            }).sort('-created_at').exec(function(err, payment) {

                if (!payment) {

                    Plan.findOne({
                        '_id': req.user.facebook.plan_id
                    }).exec(function(err, plan) {
                        if (plan.plan_name !== 'Free Trial') {
                            obj.plan = plan;
                            Plan.find({}).exec(function(err, allPlan) {

                                obj.allPlan = allPlan;
                                JSON.stringify(obj);
                                res.send(obj);
                            });
                        }
                    });
                }
            });
        }
    });
    app.post('/OnWeekOld', isLoggedIn, function(req, res) {

        var result;

        if (req.user.local.from === 'local' && req.user.local.role === 'user') {

            if (new Date(req.user.local.PlanExpried_at).getTime() < new Date().getTime() || new Date(req.user.local.PlanExpried_at).getTime() === new Date().getTime() && user.local.plan_id) {
                result = 'true';
            } else {
                result = 'false';
            }
        } else if (req.user.facebook.from === 'facebook') {
            if (new Date(req.user.facebook.PlanExpried_at).getTime() < new Date().getTime() || new Date(req.user.facebook.PlanExpried_at).getTime() === new Date().getTime() && user.facebook.plan_id) {
                result = 'true';
            } else {
                result = 'false';
            }
        }

        if (result == 'true') {

            Plan.find({}).exec(function(err, plan) {

                JSON.stringify(plan);

                res.send(plan);
            });
        } else {
            res.send('false');
        }

    });

    /*****************end of User Payment*********/


    /*
    *
    Community Dashboard
    *
    *
    */

    /****index Page**/
    app.get('/community', function(req, res) {

        Post.find({})
            .populate({
                path: 'commentsIds',
                options: {
                    sort: {
                        'order': 1
                    }
                },
                populate: {
                    path: 'userId'
                }
            })
            // .populate('commentsIds')
            .populate('userId')
            .populate('likes')
            .sort('-created_at')
            .limit(5)
            .exec(function(err, posts) {
                if (req.user) {
                    var user = req.user;
                } else {
                    var user = '';
                }
                //console.log(posts);    
                //res.send(posts);   
                res.render('user/community/index.ejs', {
                    layout: 'layouts/frontend.ejs',
                    title: 'Community Dashboard',
                    status: res.locals.login,
                    user: user,
                    blog: posts,
                    timeAgo: timeAgo,
                    message: req.flash("message"),
                    error: req.flash('error')
                });

            });
    });

    /***Load More Comment Post**/
    app.post('/loadMorePost', function(req, res) {
        var last = req.param('id');
        Post.find({
                '_id': {
                    $lt: last
                }
            })
            .populate({
                path: 'commentsIds',
                options: {
                    sort: {
                        'order': 1
                    }
                },
                populate: {
                    path: 'userId'
                }
            })
            .populate('userId')
            .populate('likes')
            .sort('-created_at')
            .limit(5)
            .exec(function(err, posts) {

                console.log(posts);
                if (posts.length > 0) {

                    JSON.stringify(posts);
                    if (req.user) {
                        var user = req.user;
                    } else {
                        var user = '';
                    }
                    //console.log(posts);    
                    //res.send(posts);   
                    res.render('user/element/loadMorePost.ejs', {
                        layout: false,
                        user: user,
                        blog: posts,
                        timeAgo: timeAgo
                    });
                } else {
                    res.send(false);
                }
            });
    });

    app.get('/readCommunity', function(req, res) {

        var postId = req.param('id');

        var not = req.param('noty');
        if (not) {
            if (req.user) {
                notification.findById(not, function(err, doc) {
                    if (doc) {
                        var findN = doc.status;
                        if (findN.length) {
                            for (var i = 0; i < findN.length; i++) {

                                if (findN[i] == req.user.id) {
                                    findN.splice(i, 1);

                                }
                            }
                            notification.findByIdAndUpdate(not, {
                                'status': findN
                            }, function(err, place) {

                            });
                        }
                    }
                });
            }
        }

        Post.find({
                '_id': postId
            })
            .populate({
                path: 'commentsIds',
                options: {
                    sort: {
                        'order': 1
                    }
                },
                populate: {
                    path: 'userId'
                }
            })
            // .populate('commentsIds')
            .populate('userId')
            .populate('likes')
            .sort('-created_at')
            .exec(function(err, posts) {
                if (req.user) {
                    var user = req.user;
                } else {
                    var user = '';
                }
                //console.log(posts);    
                //res.send(posts);   
                res.render('user/community/singlPost.ejs', {
                    layout: 'layouts/frontend.ejs',
                    title: 'Community Dashboard',
                    status: res.locals.login,
                    user: user,
                    blog: posts,
                    timeAgo: timeAgo,
                    message: req.flash("message")
                });

            });
    });


    /********read Community***********/


    /*****Search User*****/
    app.post('/SearchWithUser', function(req, res) {
        //db.users.find({"name": /.*m.*/})
        var val = req.body.value;
        //res.send(blogId);
        User.find({
                $or: [{
                    'local.user_name': {
                        $regex: '.*' + val + '.*'
                    }
                }, {
                    'facebook.user_name': {
                        $regex: '.*' + val + '.*'
                    }
                }]
            })
            .exec(function(err, user) {

                if (user.length > 0) {
                    JSON.stringify(user);
                    res.render('user/element/searchUser.ejs', {
                        layout: false,
                        user: user
                    });
                }



            });
    });
    /*************Save Post******/

    app.post('/savePost', isLoggedIn, uploadPost.any(), function(req, res) {


        var blog = new Post();

        blog.userId = req.user._id;
        blog.message = req.body.message;
        blog.title = req.body.title;
        if (req.body.fileVideo) {
            blog.video = req.body.fileVideo;
        } else {
            blog.video = '';
        }
        blog.created_at = new Date();
        blog.updated_at = new Date();
        if (req.files) {
            if (req.files.length) {

                var requests = [];
                for (var j = 0; j < req.files.length; j++) {
                    requests.push(req.files[j].filename);
                }

                JSON.stringify(requests);
                blog.image = requests;
            } else {
                blog.image = '';
            }
        } else {
            blog.image = '';
        }
        //res.send(requests);
        blog.save(function(err, data) {
            if (err) {
                req.flash('error', 'Error on save Post');
                res.redirect('/community');

            } else {

                /*****notification********/
                var adj = [];
                User.findOne({
                    'local.role': 'admin'
                }).exec(function(err, admin) {
                    adj.push(admin.id);


                    var notificatn = new notification();

                    notificatn.userId = req.user.id;
                    notificatn.PostId = data._id;
                    notificatn.type = 'add post';
                    notificatn.created_at = new Date();
                    notificatn.updated_at = new Date();
                    notificatn.status = adj;
                    notificatn.UserRecord = adj;


                    notificatn.save(function(err, res) {
                        if (err) {

                            //  res.send('err');
                        } else {


                        }
                    });
                });
                req.flash('message', 'Post has been save successfully');
                res.redirect('/community');
            }
        });
    });

    /************end of notification*****?

                                res.redirect('/community');
                            }
                        });

        });

     /********************Comment Save ***********/
    app.post('/sendPostComment', isLoggedIn, uploaded.any(), function(req, res) {
        //console.log(req.body);
        var commentSave = new PostComment();

        var blogIds = req.body.postId;
        if (req.body.commtId) {
            commentSave.commtId = req.body.commtId;
        }

        commentSave.userId = req.user.id;
        commentSave.message = req.body.field;
        commentSave.postId = req.body.postId;
        commentSave.type = req.body.type;


        commentSave.order = req.body.order;
        commentSave.parentId = req.body.parentId;
        commentSave.created_at = new Date();
        commentSave.updated_at = new Date();
        commentSave.save(function(err, data) {
            if (err) {

                // console.log(commentSave);
                res.send(err);
            } else {

                Post.findOne({
                    '_id': blogIds
                }).exec(function(err, getBlog) {
                    var commentId = getBlog.commentsIds;
                    if (commentId.length) {

                        JSON.stringify(commentId);
                        var upComment = commentId;
                        upComment.push(data._id);
                        JSON.stringify(upComment);
                    } else {
                        var upComment = [];
                        upComment.push(data._id);

                        JSON.stringify(upComment);
                    }
                    Post.findByIdAndUpdate(blogIds, {
                        'commentsIds': upComment
                    }, function(err, place) {
                        PostComment.findOne({
                            '_id': data.id
                        }).populate('userId').exec(function(err, getComment) {
                            JSON.stringify(getComment);
                            //  res.send(getComment);

                            PostComment.find({
                                'postId': blogIds
                            }).exec(function(err, allCmt) {
                                var adj = [];
                                User.findOne({
                                    'local.role': 'admin'
                                }).exec(function(err, admin) {


                                    if (allCmt) {
                                        adj.push(admin.id);
                                        for (var i = 0; i < allCmt.length; i++) {
                                            var us = allCmt[i].userId;
                                            console.log(us);
                                            console.log(adj);
                                            var userRe = includes(adj, us);
                                            console.log(userRe);
                                            if (userRe == true) {
                                                console.log('yes');
                                            } else {
                                                console.log('no');
                                                adj.push(us);
                                            }
                                        }
                                    }
                                    var notificatn = new notification();

                                    notificatn.userId = req.user.id;
                                    notificatn.PostId = req.body.postId;
                                    notificatn.type = req.body.type;
                                    notificatn.created_at = new Date();
                                    notificatn.commentId = data._id;
                                    notificatn.updated_at = new Date();
                                    notificatn.status = adj;
                                    notificatn.UserRecord = adj;


                                    notificatn.save(function(err, res) {
                                        if (err) {

                                            //  res.send('err');
                                        } else {


                                        }
                                    });

                                    res.render('user/element/postComment.ejs', {
                                        layout: false,
                                        data: getComment,
                                        type: req.body.type,
                                        timeAgo: timeAgo

                                    });

(comment.created_at)
                                });

                            });

                        });


                    });

                });
            };
        });
    });


    /****Like Post/comment***/

    app.post('/likePost', isLoggedIn, function(req, res) {
        JSON.stringify(req.body);
        console.log(req.body);
        if (req.body.ids) {
            User.findOne({
                'local.role': 'admin'
            }).exec(function(err, admin) {

                var adj = [];
                adj.push(admin.id);

                var userRe = includes(adj, req.user.id);

                if (userRe == true) {} else {
                    adj.push(req.user.id);
                }

                var blogId = req.body.ids;

                likes.findOne({
                    'userId': req.user.id,
                    'PostId': req.body.ids,
                    'type': req.body.type,
                    $or: [{
                        'action': '0'
                    }, {
                        'action': '1'
                    }]
                }).exec(function(err, liked) {

                    if (!liked) {

                        var likeSave = new likes();

                        likeSave.userId = req.user.id;
                        likeSave.PostId = req.body.ids;
                        likeSave.type = req.body.type;
                        likeSave.created_at = new Date();
                        likeSave.updated_at = new Date();
                        likeSave.action = '1';

                        likeSave.save(function(err, data) {
                            if (err) {

                                res.send('err');
                            } else {

                                /*******get total likes*********/
                                Post.findOne({
                                    '_id': req.body.ids
                                }).exec(function(err, getBlog) {
                                    var liking = getBlog.likes;
                                    if (liking.length) {

                                        JSON.stringify(liking);
                                        var upComment = liking;
                                        upComment.push(data._id);
                                        JSON.stringify(upComment);
                                    } else {
                                        var upComment = [];
                                        upComment.push(data._id);

                                        JSON.stringify(upComment);
                                    }
                                    Post.findByIdAndUpdate(blogId, {
                                        'likes': upComment
                                    }, function(err, place) {

                                        var notificatn = new notification();

                                        notificatn.userId = req.user.id;
                                        notificatn.likeId = data._id;
                                        notificatn.PostId = blogId;
                                        notificatn.type = 'Like Post';
                                        notificatn.created_at = new Date();
                                        notificatn.updated_at = new Date();
                                        notificatn.status = adj;
                                        notificatn.UserRecord = adj;
                                        notificatn.save(function(err, res) {
                                            if (err) {

                                                res.json('err');
                                            } else {


                                            }
                                        });

                                        likes.find({
                                            'PostId': req.body.ids,
                                            'type': req.body.type,
                                            'action': 1
                                        }).count(function(err, liked) {
                                            console.log(liked);

                                            likes.find({
                                                'PostId': req.body.ids,
                                                'type': req.body.type,
                                                'action': 0
                                            }).count(function(err, disLike) {
                                                /*if(!liked){
                                                  var liked = '';
                                                }*/
                                                if (!disLike) {
                                                    var disLike = '';
                                                }
                                                var obj = {};
                                                obj.liked = liked;
                                                obj.disLike = disLike;
                                                JSON.stringify(obj);

                                                res.send(obj);
                                            });


                                        });

                                    });

                                });

                                /*********end of total like*********/

                            }
                        });


                    } else {
                        console.log('outer');
                        console.log(liked._id);
                        likes.findByIdAndUpdate(liked._id, {
                            'action': 1
                        }, function(err, place) {

                            notification.findOne({
                                'PostId': blogId,
                                $or: [{
                                    'type': 'Like Post'
                                }, {
                                    'type': 'disLike Post'
                                }],
                                'userId': req.user.id
                            }).exec(function(err, findNotictn) {

                                if (findNotictn) {
                                    notification.findByIdAndRemove(findNotictn._id, function(err, getOne) {
                                        if (err) {
                                            res.send(err);
                                        } else {

                                            var notificatn = new notification();

                                            notificatn.userId = req.user.id;
                                            notificatn.likeId = liked._id;
                                            notificatn.PostId = blogId;
                                            notificatn.type = 'Like Post';
                                            notificatn.created_at = new Date();
                                            notificatn.updated_at = new Date();
                                            notificatn.status = adj;
                                            notificatn.UserRecord = adj;
                                            notificatn.save(function(err, res) {
                                                if (err) {

                                                    res.json('err');
                                                } else {


                                                }
                                            });
                                        }

                                    });
                                } else {

                                    var notificatn = new notification();

                                    notificatn.userId = req.user.id;
                                    notificatn.likeId = liked._id;
                                    notificatn.PostId = blogId;
                                    notificatn.type = 'Like Post';
                                    notificatn.created_at = new Date();
                                    notificatn.updated_at = new Date();
                                    notificatn.status = adj;
                                    notificatn.UserRecord = adj;
                                    notificatn.save(function(err, res) {
                                        if (err) {

                                            res.json('err');
                                        } else {


                                        }
                                    });


                                }
                            });


                            likes.find({
                                'PostId': req.body.ids,
                                'type': req.body.type,
                                'action': 1
                            }).count(function(err, liked) {
                                console.log(liked);
                                console.log('liked');

                                likes.find({
                                    'PostId': req.body.ids,
                                    'type': req.body.type,
                                    'action': 0
                                }).count(function(err, disLike) {
                                    console.log(disLike);

                                    var obj = {};
                                    obj.liked = liked;
                                    obj.disLike = disLike;
                                    JSON.stringify(obj);

                                    res.send(obj);
                                });


                            });




                        });
                    }

                });

            });
        }
    });

    /********dislike Post**********/
    app.post('/dislikePost', isLoggedIn, function(req, res) {
        var blogId = req.body.ids;
        if (blogId) {
            likes.findOne({
                'userId': req.user.id,
                'PostId': req.body.ids,
                'type': req.body.type,
                $or: [{
                    'action': '0'
                }, {
                    'action': '1'
                }]
            }).exec(function(err, liked) {

                if (liked) {
                    var likeId = liked._id;

                    likes.findByIdAndUpdate(likeId, {
                        'action': 0
                    }, function(err, place) {

                    });
                } else {

                    var likeSave = new likes();

                    likeSave.userId = req.user.id;
                    likeSave.PostId = req.body.ids;
                    likeSave.type = req.body.type;
                    likeSave.created_at = new Date();
                    likeSave.updated_at = new Date();
                    likeSave.action = '0';

                    likeSave.save(function(err, data) {
                        if (err) {

                            res.send('err');
                        } else {
                            var likeId = data._id;

                            Post.findById(blogId, function(err, doc) {
                                if (doc) {

                                    var likPost = doc.likes;
                                    console.log(likPost);
                                    console.log(likeId);
                                    if (likPost.length) {
                                        console.log('here');

                                        JSON.stringify(likPost);
                                        var upComment = likPost;
                                        upComment.push(likeId);
                                        JSON.stringify(upComment);
                                    } else {
                                        console.log('out');
                                        var upComment = [];
                                        upComment.push(likeId);

                                        JSON.stringify(upComment);
                                    }

                                    Post.findByIdAndUpdate(blogId, {
                                        'likes': upComment
                                    }, function(err, place) {

                                    });


                                }
                            });

                        }
                    });
                }
                notification.findOne({
                    'PostId': blogId,
                    $or: [{
                        'type': 'Like Post'
                    }, {
                        'type': 'disLike Post'
                    }],
                    'userId': req.user.id
                }).exec(function(err, findNotictn) {

                    User.findOne({
                        'local.role': 'admin'
                    }).exec(function(err, admin) {

                        var adj = [];
                        adj.push(admin.id);


                        if (findNotictn) {
                            notification.findByIdAndRemove(findNotictn._id, function(err, getOne) {
                                if (err) {
                                    res.send(err);
                                } else {

                                    var notificatn = new notification();

                                    notificatn.userId = req.user.id;
                                    notificatn.likeId = likeId;
                                    notificatn.PostId = blogId;
                                    notificatn.type = 'disLike Post';
                                    notificatn.created_at = new Date();
                                    notificatn.updated_at = new Date();
                                    notificatn.status = adj;
                                    notificatn.UserRecord = adj;
                                    notificatn.save(function(err, res) {
                                        if (err) {

                                            res.json('err');
                                        } else {

                                        }
                                    });
                                }

                            });
                        } else {

                            var notificatn = new notification();

                            notificatn.userId = req.user.id;
                            notificatn.likeId = likeId;
                            notificatn.PostId = blogId;
                            notificatn.type = 'disLike Post';
                            notificatn.created_at = new Date();
                            notificatn.updated_at = new Date();
                            notificatn.status = adj;
                            notificatn.UserRecord = adj;
                            notificatn.save(function(err, res) {
                                if (err) {

                                    res.json('err');
                                } else {

                                }
                            });


                        }

                        likes.find({
                            'PostId': req.body.ids,
                            'type': req.body.type,
                            'action': 1
                        }).count(function(err, like) {
                            console.log(like);


                            likes.find({
                                'PostId': req.body.ids,
                                'type': req.body.type,
                                'action': 0
                            }).count(function(err, disLike) {
                                console.log(disLike);
                                if (!like) {
                                    var like = '';
                                }
                                if (!disLike) {
                                    var disLike = '';
                                }
                                var obj = {};
                                obj.like = like;
                                obj.disLike = disLike;
                                JSON.stringify(obj);

                                res.send(obj);
                            });


                        });
                    });
                });

            });
        }
    });

    /*
    *
    delete comment Post
    *
    */
    app.get('/delComntPost', isLoggedIn, function(req, res) {
        var commentId = req.param('id');
        Post.findById(commentId, function(err, post) {
            console.log(post);
            if (post.image) {
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

            if (post.video && post.video != '[object FileReader]') {
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


            if (post.likes) {
                var like = post.likes;
                if (like.length) {
                    for (var j = 0; j < like.length; j++) {
                        if (like[j]) {
                            var likeId = like[j];

                            likes.findByIdAndRemove(likeId, function(err, removeLike) {
                                if (err) {
                                    res.send(err);
                                }
                            });
                        }
                    }
                }
            }
            PostComment.find({
                'postId': commentId
            }, function(err, postCommt) {

                if (postCommt) {
                    if (postCommt.length) {
                        for (var j = 0; j < postCommt.length; j++) {
                            if (postCommt[j].id) {
                                var id = postCommt[j].id;
                                PostComment.findByIdAndRemove(id, function(err, removeCom) {
                                    if (err) {
                                        // res.send(err);
                                    }
                                });
                            }
                        }
                    }
                }
            });
            notification.find({
                'PostId': commentId
            }).exec(function(err, findNotictn) {
                if (findNotictn) {
                    if (findNotictn.length) {
                        for (var j = 0; j < findNotictn.length; j++) {
                            if (findNotictn[j].id) {
                                var id = findNotictn[j].id;

                                notification.findByIdAndRemove(id, function(err, getOne) {
                                    if (err) {
                                        //res.send(err);
                                    } else {}
                                });
                            }
                        }
                    }
                }
            });

            Post.findByIdAndRemove(commentId, function(err, removePost) {
                if (err) {
                    req.flash('error', 'Error, Please try again.');
                    res.redirect('/community');
                } else {
                    req.flash('message', 'Post has been delete successfully');
                    res.redirect('/community');

                }

            });
        });
    });


    /************end of community Dashboard*******/

    /**** chat function ************/
app.post('/saveuserchat',function(req, res) {


 
              
                var sender=req.param("senderid");
                var receiver = req.param("receiverid");
                var msg = req.param("msg");
                //var username=req.param("username");
                //res.send(userId);
                var saveuserschat = new chat();
              saveuserschat.reciever = receiver;
              saveuserschat.msg_desc = msg;
              saveuserschat.sender=sender;
              saveuserschat.userid=sender;
              saveuserschat.role='user';
              saveuserschat.created_at = new Date();
               

               saveuserschat.save(function(err, data) {
                    if (err) {


                         res.send('error') ;
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
app.post('/getuserchat',function(req, res) {

var last = req.param('chatlast'),
    sender = req.param("senderid"),
    adminid = req.param("adminid") ;
//receiver = req.param("receiverid"),
   
if(last != 'no')
{
var response = { } ; 
chat.find({ $and :[{'_id': { $gt: last } },{'userid':  sender }] }).limit(5).sort('created_at').exec( function(err, result){

response['result'] = result ; 

User.find({ '_id' : adminid }, function(error , adminrecord )
{

response['adminrecord'] = adminrecord ;
response['timeAgo']=timeAgo;
res.json(JSON.stringify(response));

}) 


})


}
else
{

/*chat.find({ $and :[{'sender':  sender },{'reciever': receiver  }] }).limit(5).sort({$natural:-1}).exec( function(err, result){
*/

var response = { } ; 


chat.find({ $and :[{'userid':  sender }] }).count( function(err, total){
    var totalcount="";
    if (total<5)
    {
totalcount=0;
    }
    else
    {
totalcount=total-6;
    }

chat.find({ $and :[{'userid':  sender }] }).skip(totalcount).limit(6).exec( function(err, result){
//chat.find({ $and :[{'userid':  sender }] }).exec( function(err, result){

response['result'] = result ; 

User.find({ '_id' : adminid }, function(error , adminrecord )
{

response['adminrecord'] = adminrecord ;
response['timeAgo']=timeAgo;
res.json(JSON.stringify(response));

}) ; // user find end here



}) 

}) 

}



            });

app.post('/loaduserchat',function(req, res) {

var userid = req.param('userid');
var senderid = req.param('senderid');
var adminid = req.param('adminid');
var response = { } ; 
chat.find({ $and :[{'_id': { $lt: userid } },{'userid': senderid  }] }).exec( function(err, total){
    var totalcount= total.length;

    var totalcount1="";
    if (totalcount<5)
    {
totalcount1=0;
    }
    else
    {
totalcount1=totalcount-5;
    }
chat.find({ $and :[{'_id': { $lt: userid } },{'userid': senderid  }] }).skip(totalcount1).limit(5).exec( function(err, result){

//res.json(JSON.stringify(result));
response['result'] = result ; 

User.find({ '_id' : adminid }, function(error , adminrecord )
{

response['adminrecord'] = adminrecord ;
//response['timeAgo']=timeAgo;
res.json(JSON.stringify(response));

}) 


}) 
}) 



            });
 /**** chat function ************/
    /************loggined check******/
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            //   res.redirect('back');
            return next();
            //console.log(req.route.Route);
            //res.send(res);
            /*     if (!req.session.userid) {
        req.session.redirectTo = '/account';
        res.redirect('/login');
    } else {
        next();
    }*/

        }


        // if they aren't redirect them to the home page
        req.flash('loginMessage', "Please login first, for access the page.");
        res.redirect('/login');
    }
    /************end of checking***/
}