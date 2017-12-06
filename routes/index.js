var express = require('express'); 
var router = express.Router();
  var Plan = require('../app/models/plan');
  var trainercontent=require('../app/models/trainercontent');
  var homecontent=require('../app/models/content');
  var homeimage=require('../app/models/homeimage');
  var trainerinfo=require('../app/models/trainerinfo');
  var traininginfo=require('../app/models/traininginfo');
  var subscplancontent=require('../app/models/subscplancontent');
  var banner=require('../app/models/banner');

/* GET home page. */
router.get('/', function(req, res, next) {
Plan.find({}).exec( function (err,plan){
	 trainercontent.find({}).exec(function(err, content1) {
	homecontent.find({}).exec(function(err, homecontent1) {
		homeimage.find({}).exec(function(err, homecontent2) {
			trainerinfo.find({}).exec(function(err, trainerinf) {
			traininginfo.find({}).exec(function(err, traininginf) {
	subscplancontent.find({}).exec(function(err, subscplancontents) {
	banner.find({}).exec(function(err, bannerinfo) {
	
	//res.send(bannerinfo);
  res.render('index', { layout:'layouts/frontend.ejs', plans: plan, title: 'Travel',contents1:content1,homecontents1:homecontent1,homecontents2:homecontent2,trainerinfs:trainerinf,traininginfs:traininginf,subscplancont:subscplancontents,bannerinfos:bannerinfo,status : res.locals.login, user: req.user,message : req.flash('message') });
});
	 });
});
});
});
});
});
});
});
module.exports = router;
  