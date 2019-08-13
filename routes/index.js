var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "/campgrounds/",
//         failureRedirect: "/login",
//         successFlash: 'Welcome!' ,
//         failureFlash: true 

//     }), function(req, res){
//         // req.flash("success", "welcome " + req.body.username);
//         // console.log("id is "+ req.bo);
// });


router.post("/login",function(req,res,next){
    passport.authenticate('local',function(err,user,info){
        if (!user) {
            console.log("user not authenticated" );
            
            // console.log(req.params);    
            return res.redirect('/login');}
        // req.logIn(user,function(err){
            // res.redirect("/login")
            req.login(user,function(err){
                if (err) {
                    return next(err)};
            });
        console.log(req.session);
        
        url = req.session.url;
        console.log("URL IS ---->" + url);
        
        req.session.url='';
        console.log("after delete URL IS ---->" + url);

        console.log("req.session.url \n " + url);
        var redirectionUrl = url || "/campgrounds";
        url='';

        res.redirect(redirectionUrl);
    })(req, res, next);
   
    });

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



module.exports = router;