require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


// home page
app.route("/")

  .get(function(req, res) {
    res.render("home");
  });


//login
app.route("/login")

  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
      email: username,
    }, function(err, foundAccount) {
      if (err) {
        console.log(err);
      } else if(!foundAccount) {
        res.send("this is not a valid account");
      } else if(foundAccount.password == password) {
        res.render("secrets");
      }
    })
  });


// register
app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
      const newUser = new User({
        email: req.body.username,
        password: req.body.password
      })

      newUser.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.render("secrets")
          }
        })
      });







    app.listen(3000, function() {
      console.log("server started on port 3000");
    });
