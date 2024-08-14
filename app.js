const express = require('express')
const app = express()

const port = 3000

const usermodel = require("./user")
const postmodel = require("./post")
var bodyParser = require("body-parser")
const upload = require("./multer");
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
 extended: true
 }));



const passport = require("passport");
const expressSession = require("express-session");
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(express.json());
app.use(expressSession({
  resave : false,
  saveUninitialized : false,
  secret: "sjhhdso"

}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usermodel.serializeUser())
passport.deserializeUser(usermodel.deserializeUser())
const localStrategy = require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));

app.get('/', (req, res) => {
  res.render("index")
})
app.get('/loginpage', (req, res) => {
  res.render("login")
})
app.get('/profile',isLogedin, async function(req, res, next ){
  const user = await usermodel.findOne({
    username : req.session.passport.user
  }).populate("posts");
  console.log(user)
  res.render("profile" , {user});
})

app.post('/register', (req, res) => {
   var userdata = new usermodel({
      
    name : req.body.name,
    username : req.body.username
   });
   usermodel.register(userdata,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
   })
})
app.get('/uploadcontent',isLogedin ,(req, res) => {
  res.render("uploadcontent")
})
app.post("/login",passport.authenticate("local", {
  successRedirect:"/profile",
  failureRedirect: "/"
}), function(req,res){
 
});

app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})
app.post('/upload',isLogedin ,upload.single("file") , async function(req, res, next){
  // if(!req.file){
  //   return res.status(404).send("no files wew given")
  // }
  // res.send("file uploded suscesfully")
  const user = await usermodel.findOne({
    username : req.session.passport.user
   })
    user.dp = req.file.filename;
    await user.save();
    res.redirect("/profile")

} );
app.post('/uploadcnt',isLogedin ,upload.single("file") , async function(req, res, next){
  if(!req.file){
    return res.status(404).send("no files wew given")
  }
  // res.send("file uploded suscesfully")
  const user = await usermodel.findOne({
    username : req.session.passport.user
   })
   const post = await postmodel.create({
    desc: req.body.desc,
    image : req.file.filename,
    userid : user._id
   })

   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile");
   

} );

app.get('/feed',isLogedin,async function(req, res){
const posts =  await postmodel.find().populate("userid");
  
  res.render("feede",{posts});
  // console.log(posts);
  
})


 
function isLogedin(req,res,next){
  if( req.isAuthenticated()) return next();
  res.redirect("/")
}




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})