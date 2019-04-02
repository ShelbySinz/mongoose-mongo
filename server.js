var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongooseHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://magazine.realtor/daily-news").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article").each(function(i, element) {
        // Save an empty result object

        // Add the text and href of every link, and save them as properties of the result object
        var title = $(this)
          .find( ".node__title a")
          .text();
        var link = $(this)
          .find(".node__title a")
          .attr("href");
        var summary = $(this)
          .find("p");  
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create({
            title: title, 
            link: link, 
            summary: summary
        })
          .then(function(dbArticle) {
            // View the added result in the console
            res.json(dbArticle);
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      
    });
  });
  
  app.get("/", function(req, res) {
    
    db.Article.find({}).populate("note")
    .then(function(dbArticle){
        
         
            // var notebody= data[0].dataValues.Note.dataValues.body;
            var hbsobj = {
                articles: dbArticle,
               
                // notes: notebody
            };

            res.render("index", hbsobj);
            console.log(hbsobj);
    });
    });
   

  app.get("/notes/:id", function(req, res){
      db.Article.findOne({_id: req.params.id }).populate("note").then(function(notes){
        //    var obj= {
        //        note:notes
        //    }
        //   res.render("index", obj)
        //   console.log(notes);
        res.json(notes)
      })
      .catch(function(err){
          res.json(err);
      });
  });

app.put("/articles/:id", function(req, res){
    db.Article.updateOne({_id: req.params.id}, {favorite: true})
    .then(function(updatedFavorite){
        res.json(updatedFavorite);
        console.log(updatedFavorite);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/note/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
db.Note.create(req.body).then(function(dbnote){
    console.log(dbnote);
   return db.Article.findOneAndUpdate({ _id: req.params.id },{note: dbnote._id} ,{new: true});
})
.then(function(dbArticle) {
   console.log(dbArticle);
   

}).catch(function(err){
    res.json(err);
});
});
      
 

app.delete("/delete", function(req, res){
  db.Article.remove({}).then(function(){
      console.log("deleted all articles")
  });
});


app.delete("/deleteNote/:id", function(req, res){
    db.Note.remove({_id: req.params.id}).then(function(){
        console.log("deleted note");
    });

});








app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });