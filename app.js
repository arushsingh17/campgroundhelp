const express=require('express');
const app=express();
const path=require('path');//app.set("views",path.join(__dirname,"views")) USED for this line so we run this code from anywhere
const mongoose = require('mongoose');
const Campground = require('./models/campground');//to make the code shorter as exporting the campground model
const methodOverride = require('method-override');//for making fake request like put delete to the web server
const ejsMate=require('ejs-mate')//it is package used to make the boilerplate section in layout which can be used everywhere
const catchAsync=require("./utils/catchAsync")//dot is used when we are requiring any locally created class
const ExpressError=require("./utils/expressError")//it is requiring the custom error class
const { campgroundSchema } = require('./schemas.js');//joi is a specific package used to handle errors and make the error page more accurate by defining a prechema which when validate give a error object which contains the detail anf thus a more informative erroor




mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', 
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));//to check whether the connection is established or not
db.once("open", () => {
    console.log("Database connected");
});

app.engine("ejs",ejsMate)
app.use(methodOverride('_method'));//app .use are used to run  middlewares only
app.use(express.urlencoded({extended:true}))//bydefault req.body is empty for this we use a mehtod in express
app.use(methodOverride('_method'));//this is used so we can put in fake request like delete and put request as form only allows get and  post
app.set("view engine","ejs");//always look into the views directory for ejs file
app.set("views",path.join(__dirname,"views"));//always used so we can run this code from terminal anywhere
//for error handling use try or catch or wrapper function
const validateCampground = (req, res, next) => {//used to defined a middewhere which would run
    const { error } = campgroundSchema.validate(req.body);//campgroundscheme is a predefined schema so it can give an arror even before going to the moongoose top get an error
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)//this thrown is caught by the catch of the wrapper function whic thus calls the next function
    } else {
        next();
    }
}



app.get("/",function(req,res){
    res.send("hello from yelp camp");
})
app.get("/campgrounds",catchAsync(async function(req,res){//main index page
       const campgrounds=await Campground.find({})//await passes the resolved object of the promise no need to use function of then and pluss the model.find methods dont return something they contain when their promise is resolved and and passed as object so await keyword is used
       res.render('campgrounds/index',{campgrounds})

    }))  
app.get('/campgrounds/new',function(req,res){

        res.render('campgrounds/new')
    
    })

app.get('/campgrounds/:id',async function(req,res,next){
    //individual campgrounds page
    try{
 
    const campground=await Campground.findById( req.params.id)//await passes the resolved object of the promise no need to use function of then
    res.render('campgrounds/show',{campground})//going to the ejs file
    }
    catch(e){
        next(e);
    }
})   

app.post("/campgrounds",validateCampground,catchAsync(async function(req,res){//validatecampground to run a specific middleware
    
    const campground=new Campground(req.body.campground)
   
   
    await campground.save()//await passes the resolved object of the promise no need to use function of then and pluss the model.find methods dont return something they contain when their promise is resolved and and passed as object so await keyword is used
    res.redirect(`/campgrounds/${campground._id}`)

// next it calls the next  middleware associated with eroor



 })) //wrapper function used insttead of try and catch you can use try and catch also
 app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)//use await keyword for direct resolved oobject or use .then and pass a callback function to it which contains the resolved object
    res.render('campgrounds/edit', { campground });
}))
app.put('/campgrounds/:id',validateCampground,async (req, res,next) => {
    try{
    const { id } = req.params;//deconstructing
   
    const campgrounds = await Campground.findByIdAndUpdate(id,  {... req.body.campground} );  // spreading that object inside this object thats why ... is used//await make sures that retunr of the promise is the resolved object as model.method in itself does not return anything
    res.redirect(`/campgrounds/${campgrounds._id}`)   
 }
    catch(e){//try and catch method used instead of wrapper functions
        next(e);//next it calls the next  middleware associated with eroor

    }
});
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
const { id } = req.params;
await Campground.findByIdAndDelete(id);
res.redirect('/campgrounds');
}))
app.all("*",(req,res,next) =>{//this is only run when of the above path or request does not responds with anything gthein it responds with 404 error
    next(new ExpressError("page not found",404))//sending specific error and goes to error handling middleware
})
app.use(function(err,req,res,next){//four parameter need to be defined for error handling middleware
    const{statusCode=500,message="something went wrong"}=err//default arguments while deconstructing
    res.status(statusCode).render("error",{err})
    
  //error middle ware which handles in error thrown its way ans ends the request the cycle with respnse
})





app.listen(3000,function(){
    console.log("surveying on port");
})

