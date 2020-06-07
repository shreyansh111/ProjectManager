var mongoose =require("mongoose")
mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);
var taskschema=mongoose.Schema({
	name:String,
	Days:Number,
	progess:Number,
	discription:String,
	Owner:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
})
module.exports=mongoose.model("Task",taskschema)