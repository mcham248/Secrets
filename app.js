require("dotenv").config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

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
      } else if (!foundAccount) {
        res.send("this is not a valid account");
      } else if (foundAccount) {
        bcrypt.compare(password, foundAccount.password, function(err, result) {
          if (result == true){
            res.render("secrets");
          }
        });
        bcrypt.compare(password, foundAccount.password, function(err, result) {
          if (result == false) {
            res.send("Your password is incorrect");
          }
        });
      }
    });
  });


// register
app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })



  .post(function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      })

      newUser.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.render("secrets");
          console.log("sucessfully created new account");
        }
      })
    });
  });







app.listen(3000, function() {
  console.log("server started on port 3000");
});
