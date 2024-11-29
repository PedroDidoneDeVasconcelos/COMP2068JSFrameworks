const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/habits');
  }
  res.render("index", { title: "Welcome to Habit Tracker" });
});

// GET /login
router.get("/login", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/habits');
  }
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { title: "Login", messages: messages });
});

// POST /login
// Syntax will be a bit different since login will be handled by passport
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/habits",
    failureRedirect: "/login",
    failureMessage: "Invalid credentials",
  })
);

// GET /register
router.get("/register", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/habits');
  }
  res.render("register", { title: "Create a new account" });
});

//POST /register
router.post("/register", (req, res, next) => {
  if (req.body.password !== req.body.confirm) {
    return res.render('register', {
      title: 'Create a new account',
      error: 'Passwords do not match'
    });
  }

  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.render('register', {
          title: 'Create a new account',
          error: 'Username already exists'
        });
      }
      req.login(newUser, (err) => {
        if (err) return next(err);
        res.redirect("/habits");
      });
    }
  );
});

// Add this route to your existing routes
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
