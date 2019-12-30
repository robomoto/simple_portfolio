var express = require("express");
var router = express.Router();
var passport = require("passport");
var Project = require("../models/project");
var User = require("../models/user");

//middleware to put current user info on all routes.
router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

router.get("/", function(req, res){
    res.redirect("/index");
});

//RESTFUL ROUTES
//name      url         verb        desc
//============================================================
//INDEX     /dogs       GET         Display a list of all dogs
//NEW       /dogs/new   GET         Displays form to create new dog
//CREATE    /dogs       POST        Adds a new dog to the database
//SHOW      /dogs/:id   GET         Shows info about one dog
//EDIT      /dogs/:id/edit  GET     Show edit form for one dog
//UPDATE    /dogs/:id   PUT         Update particular dog, then redirect somewhere
//DESTROY   /dogs/:id   DELETE      remove one dog

//====================================
//INDEX     /index           GET
//====================================
router.get("/index", function(req, res){
       //Get all projects from DB
       //admin logged in
    if(req.isAuthenticated() && res.locals.currentUser.role == "admin"){  
        Project.find({category: 'blog'}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });
        //guest
    } else if(req.isAuthenticated() && res.locals.currentUser.role == "guest") {             
        Project.find({category: 'blog', isPublished: true}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });    
        //no login
    } else {            
        Project.find({category: 'blog', display: "public", isPublished: true}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });    
    }
});

//====================================
//INDEX     /misc           GET
//====================================
router.get("/misc", function(req, res){
       //Get all projects from DB
       //admin logged in
    if(req.isAuthenticated() && res.locals.currentUser.role == "admin"){
        Project.find({category: 'misc'}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });
    } else if(req.isAuthenticated() && res.locals.currentUser.role == "guest") {
        Project.find({category: 'misc', isPublished: true}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });
    } else {
        //no login
        Project.find({category: 'misc', display: 'public', isPublished: true}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });    
    }
});

//====================================
//INDEX     /projects           GET
//====================================
router.get("/projects", function(req, res){
    //Get all projects from DB
    //admin logged in
    if(req.isAuthenticated() && res.locals.currentUser.role == "admin"){
        Project.find({category: 'project'}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });
    } else if(req.isAuthenticated() && res.locals.currentUser.role == "guest") {
        Project.find({category: 'project', isPublished: true}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });
    } else {
        //no login
        Project.find({category: 'project', display: 'public', isPublished: true}, function(err, projects){
        if(err){
            console.log(err);
        } else {
            console.log(projects);
            res.render("projects", {projects:projects})
        }
        });    
    }
});

//====================================
//NEW       /projects/new       GET
//====================================
router.get("/projects/new", isLoggedIn, function(req, res){
    res.render("new");
});

//====================================
//CREATE    /projects           POST
//====================================
router.post("/projects", isLoggedIn, function(req, res){
    var newProject = req.body.Project;
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/projects");
        }
    });
});

//====================================
//SHOW      /projects/:id       GET
//====================================
router.get("/projects/:id", function(req, res){
    Project.find({_id: req.params.id}, function(err, project){
        if(err){
            console.log(err);
        } else {
                //admin logged in
            if(req.isAuthenticated() && res.locals.currentUser.role == "admin"){
                res.render("adminProject", {project:project});
            } else {
                //admin logged in
                res.render("showProject", {project:project});
            }
        }
    });
});

//====================================
//EDIT      /projects/:id/edit  GET
//====================================
router.get("/projects/:id/edit", isLoggedIn, function(req, res){
    Project.find({_id: req.params.id}, function(err, project){
        if(err){
            console.log(err);
        } else {                
            res.render("edit", {project: project});
        }
    });
});

//====================================
//UPDATE    /projects/:id       PUT
//====================================
router.put("/projects/:id", function(req, res){
    Project.findByIdAndUpdate({_id: req.params.id}, req.body.Project, function(err, project){
        if(err){
            console.log(err);
            res.redirect("/projects");
        } else {
            res.redirect("/projects/" + req.params.id);
        }
    });
});

//====================================
//DESTROY   /projects/:id       DELETE
//====================================
router.delete("/projects/:id", isLoggedIn, function(req, res){
    Project.findByIdAndRemove({_id: req.params.id}, function(err, project){
        if(err){
            console.log(err);
        } else {
            console.log(project);
            res.redirect("/projects")
        }
    });
});


//====================================
//USER LOGIN INFORMATION
//====================================

//show register form
router.get("/register", function(req, res){
    res.render("register");
})

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        } else {
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
        }
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
})

//handle login logic
router.post("/login", passport.authenticate("local", 
            {
                successRedirect: "/index", 
                failureRedirect: "/login"
            }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        console.log("attempting task that requires login.")
        res.redirect("/login");
    }
}

function isAdmin(req, res, next){
    if(res.locals.currentUser.role == "admin"){
        return next();
    } else {
        console.log("Non-Admin attempting admin task.")
        res.redirect("/index");
    }
}

module.exports = router;