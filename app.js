var express         = require('express'),
    app 		    = express(),
    bodyParser      = require("body-parser"),
	mongoose	    = require("mongoose"),
	flash			= require("connect-flash"),
	passport        = require("passport"),
	LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
	methodOverride  = require("method-override"),
	Comment		    = require("./models/comment"),
	User            = require("./models/user"),
	seedDB		    = require("./seeds");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index"); 

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.locals.moment = require("moment-timezone");

// seedDB(); //seed the database

//PASSPORT Confirguration
app.use(require("express-session")({
	secret: "YelpCamp is progressing day by day",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	res.locals.failure	   = req.flash("failure");
	next();
});

//Some changes for git commit
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// var port = process.env.PORT || 3000;
// app.listen(port, function(){
// 	console.log("Server started");
// });

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Server Started!!");
});