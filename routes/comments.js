var express 	  = require("express"),
    router  	  = express.Router({mergeParams : true}),
    Campground    = require("../models/campground"),
	Comment		  = require("../models/comment"),
	middleware	  = require("../middleware");

//camments new
router.get("/new", middleware.isLoggedIn,  function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err)
			console.log(err);
		else{
			res.render("comments/new", {campground : campground});
		}
	});
});

//code for post request sent for posting a comment
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}			
		else{
		   //create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong!");
					console.log(err);					
				}else{
					//add usename and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//connect new comment to campground
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("success", "Successfully added comment.");
					//redirect to campground showpage
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});

});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id : req.params.id , comment : foundComment});
		}
	});
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//findByIdandRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted!");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

module.exports = router;