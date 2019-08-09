var express 	  = require("express"),
    router  	  = express.Router(),
    passport      = require("passport"),
	User          = require("../models/user");	

//Root route
router.get("/", function(req, res){
	res.render("landing");
});

//show register form
router.get("/register", function(req, res){
	res.render("register", {page : 'register'});
});

//handle Signup logic
router.post("/register", function(req, res){
	var newUser= new User({username: req.body.username});
	if(req.body.adminCode === process.env.SECRET_CODE){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login", {page : 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
	failureFlash: true,
	successFlash: true
}), function(req, res){
	passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
	passport.authenticate('local', { successFlash: 'Welcome!' });

});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out Successfully");
	res.redirect("/campgrounds");
});

module.exports = router;