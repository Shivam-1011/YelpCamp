var mongoose = require("mongoose");

//Schema Setup

var campgroundSchema = new mongoose.Schema({
	name     	: String,
	image     	: String,
	description : String,
	price       : Number,
	location    : String,
	lat         : Number,
	lng         : Number,
	createdAt   : {
		type : Date,
		default : Date.now
	},
	author		: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments	: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]
});
module.exports = mongoose.model("Campground", campgroundSchema);