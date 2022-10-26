const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

//Environment variabes
const id = process.env.USER_ID;
const pw = process.env.PASSWORD;
const cluster = process.env.CLUSTER_NAME;
const url ="mongodb+srv://" + id + ":" + pw + "@" + cluster + ".mongodb.net/blogDB"; 
mongoose.connect(url);

const blogSchema = {
  title: String,
  content: String,
};
new mongoose.Schema(blogSchema);
const Blog = mongoose.model("Blog", blogSchema);

const blog1 = new Blog({
  title: "Compose a blog",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
});

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let posts = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { postArray: blogs, laurem1: blog1 });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { laurem2: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { laurem3: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

//Adding new post to blog
app.post("/compose", function (req, res) {
  const post = {
    content: req.body.postBody,
    title: req.body.postTitle,
  };

  const blog = new Blog({
    title: post.title,
    content: post.content,
  });

  blog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postID", function (req, res) {
  Blog.find({ _id: req.params.postID }, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", { title1: blogs[0].title, body1: blogs[0].content });
    }
  });
});

app.get("/delete/:postID", function (req, res) {

  Blog.findByIdAndDelete(req.params.postID, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted blog");
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});