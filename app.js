var express        =require("express")
var app            =express()
var bodyParse      =require("body-parser")
var mongoose       =require("mongoose")
var passport       =require("passport")
var localStrategy  =require("passport-local")
var User           =require("./models/user")
var Task           =require("./models/task")
var GroupWork      =require("./models/teamtask")
var mehodOverride  =require("method-override")
var flash          =require("connect-flash")
app.use(express.static(__dirname + "/public"))
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
app.use(bodyParse.urlencoded({extended:true}));
app.use(mehodOverride("_method"));
mongoose.connect("mongodb://localhost/todoappv1")
app.use(require("express-session")({
	secret:"dont get to close",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine","ejs")
app.use(flash())
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next()

})
app.get("/",function(req,res){
	
		res.render("index")
})
app.get("/signup",function(req,res){
	res.render("signup")
})
app.post("/register",function(req,res){
  var newUser =new User({username : req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("signup")
		}
		else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","welcome to yellcamp"+user.username)
				res.redirect("/")
			})
		}
	}) 
})
app.get("/login",function(req,res){
	     
		res.render("login")
})
app.post("/login",passport.authenticate("local",
	{ successRedirect:"/",
      failureRedirect:"/login"
    }),function(req,res){

    })
app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out")
	res.redirect("/")
})
app.get("/show",IsLoggedIn,function(req,res){
	Task.find({},function(err,task){
		if(err){
			console.log(err)
		}
		else{
			GroupWork.find({},function(err,team){
				if(err){
					console.log(err)
				}
				else{
					res.render("show",{tasks:task,teams:team})
				}
			})
			
			
		}
	})
})
app.get("/new",IsLoggedIn,function(req,res){
	res.render("new")
})
app.post("/new",IsLoggedIn,function(req,res){
	
    Task.create(req.body.task,function(err,task){
      	if(err){
      		console.log(err)
      	}
      	else{
      		task.Owner.id=req.user._id
      		task.Owner.username=req.user.username
      		task.save()
      		res.redirect("/")
      	}
      }) 
	
      
})
app.get("/:id",IsLoggedIn,function(req,res){
	Task.findById(req.params.id,function(err,task){
		if(err){
			console.log(err)
		}
		else{
			res.render("display",{task:task});		}
	})

})
app.get("/:id/edit",IsLoggedIn,function(req,res){
	Task.findById(req.params.id,function(err,found){
		if(err){
			console.log(err)
		}
		else{
			res.render("edit",{task:found})
		}
	})
})
app.put("/:id",IsLoggedIn,function(req,res){
	Task.findByIdAndUpdate(req.params.id,req.body.task,function(err,task){
		if(err){
			res.redirect("/show")
		}
		else{
			res.redirect("/show")
		}
	})
})
app.delete("/:id",IsLoggedIn,function(req,res){
	Task.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/show")
		}
		else{
			res.redirect("/show")
		}
	})
})
app.get("/team/new",IsLoggedIn,function(req,res){
	res.render("team")
})
app.post("/team",IsLoggedIn,function(req,res){
	GroupWork.create(req.body.team,function(err,team){
		if(err){
			console.log(err)
		}
		else{
			team.Leader.id=req.user._id
			team.username=req.user.username
			team.progress1=0
			team.progress2=0
			 team.progress3=0
            team.save()
            res.redirect("/")

		}
	})
})

app.get("/team/:id",function(req,res){
	GroupWork.findById(req.params.id,function(err,group){
		if(err){
			console.log(err)
		}
		else{
			res.render("teamshow",{team:group})
		}
	})
})
app.post("/team/:id/join",function(req,res){
	GroupWork.findById(req.params.id,function(err,group){
		if(err){
			console.log(err)
		}
		else{
			var sun={}
			sun.id=req.user._id
			sun.username=req.user.username
			group.Teammates.push(sun)
			group.save()
			res.redirect("/")
		}
	})
})
 function IsLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		 return next()
	}
	req.flash("error","you need to be login to do that")
	res.redirect("/login")
    }  
 
app.listen(8080,function(){
	console.log("server started")
})