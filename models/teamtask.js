var mongoose =require("mongoose")
mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);
var teamtaskschema=mongoose.Schema({
	name:String,
	Days:Number,
	discription:String,
	progress1:Number,
	progress2:Number,
	progress3:Number,
	Leader:{
           id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
    Teammates:[{
    	 id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
    }
    ]
})
module.exports=mongoose.model("GroupWork",teamtaskschema);