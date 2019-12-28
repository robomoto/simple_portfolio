var express = require("express");
var app = express();

var bodyParser = require("body-parser"),
    Project = require("./models/project"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"), 
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"); 

var routes = require("./routes/routes");

app.set("view engine", "ejs");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/project_app");

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "CHANGE THIS BEFORE USING IT FOR A LIVE WEBSITE",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to put current user info on all routes.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(routes);

app.listen(3000, function(){
	console.log("listening on 3000.")
});