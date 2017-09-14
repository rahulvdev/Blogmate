var express=require("express");
var body_parser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var app=express();

//App config
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost/blogapp",{useMongoClient: true});
app.set("view engine","ejs");
app.use(body_parser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));


//Mongoose/Model/Config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

//Restful Routes
app.get("/",function(req, res){
       res.redirect("/blogs"); 
});


app.get("/blogs",function(req, res){
      Blog.find({},function(err, blogs){
        if(err){
            console.log("ERROR!!");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
})

app.get("/blogs/new", function(req, res){
    res.render("new");
})

app.post("/blogs",function(req, res){
    try{
        //req.body.blog.description=req.sanitizer(req.body.blog.description);
        Blog.create(req.body.blog,function(err, blog){
       if(err){
           res.redirect("/blogs/new");
       } 
       else{
           res.redirect("/blogs");
       }
    });
   }
   catch(exception){
       res.render("Error")
   }
    
})

app.get("/blogs/:id",function(req, res){
    var id=req.params.id;
    Blog.findById(id,function(err, blog){
        if(err){
            res.render("error");
        }
        else{
            res.render("blogpage",{blog:blog});
        }
    });
});

app.get("/blogs/:id/edit",function(req, res){
    var id =req.params.id;
    Blog.findById(id,function(err, blog){
       if(err){
           res.render("error");
       } 
       else{
           res.render("edit",{blog:blog});
       }
    });
});


app.put("/blogs/:id",function(req, res){
    //req.body.blog.description=req.sanitizer(req.body.blog.description);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs/"+updatedBlog._id);
       }
    });
});

app.delete("/blogs/:id",function(req, res){
    var id=req.params.id;
    Blog.findByIdAndRemove(id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server Started"); 
});