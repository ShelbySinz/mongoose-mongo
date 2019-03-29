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
      $("article h3").each(function(i, element) {
        // Save an empty result object

        // Add the text and href of every link, and save them as properties of the result object
        var title = $(element)
          .children("a")
          .text();
        var link = $(element)
          .children("a")
          .attr("href");
        var summary = $(element)
          .children("p");  
  
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
      res.json(dbArticle);
    });
  });
  
  app.get("/", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    .then(function(dbArticle){
        var hbsobj = {
            articles: dbArticle
        };
        res.render("index", hbsobj);
    })
    .catch(function(err){
      res.json(err);
    });
  });
















app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });