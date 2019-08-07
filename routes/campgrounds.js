var express 	  = require("express"),
    router  	  = express.Router(),
    Campground    = require("../models/campground"),
	Comment       = require("../models/comment"),
	middleware	  = require("../middleware");


//INDEX ROUTE - Shows all campgrounds
router.get("/", function(req, res){
	//GET all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err)
			console.log(err);
		else{
			res.render("campgrounds/index", {campgrounds : allCampgrounds, page : 'campgrounds'});
		}		
	});
});

//CREATE ROUTE- Add new campgrounds to Db
router.post("/", middleware.isLoggedIn, function(req, res){
	
	//get data from form and add to campgrounds array
	var name  = req.body.name;
	var image = req.body.image;
	var desc  = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground =  {name        : name, 
						  image       : image,
						  price       : price,
						  description : desc, 
						  author      : author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect to campgrounds
			res.redirect("/campgrounds");			
		}	
	});
});

//NEW ROUTE- Show form to  create new Campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW- Shows more info about a campground
router.get("/:id", function(req, res){
	//Find Campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//Render Show template with that campground
			res.render("campgrounds/show", {campground : foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "You need to be logged in to do that!");
				res.redirect("back");
			}else{
				res.render("campgrounds/edit", {campground : foundCampground});
		}
	});	
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkOwnership, function(req,  res){
	//Find and Update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//Redirect Somewhere
			res.redirect("/campgrounds/" + req.params.id);
		}
	});	
});
	
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
		if(err){
			res.redirect("/campgrounds");
		}else{
			Comment.deleteMany({_id: { $in: campgroundRemoved.comments }}, function(err){
				if(err){
					console.log(err);
				}else{
					res.redirect("/campgrounds");
				}
			});
		}
	});
});

module.exports = router;