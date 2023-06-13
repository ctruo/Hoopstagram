const express = require("express");
const passport = require("passport");
const isValidRequest = require("../middleware/middleware");

const router = express.Router();

//signup and login use Passport.js Middleware to authenticate
//located in auth/passportConfig.js

//session is created on signup so user doesn't have to re login
router.post("/signup", isValidRequest, (req, res, next) => {
  passport.authenticate("signup", (error, user, info) => {
    if (error) {
      console.log("\nSignupPassportAuthenticate Error: " + error);
      return res
        .status(500)
        .send({ errorMsg: "Something went wrong. Please try again" });
    }

    //user was not able to sign up
    if (!user) {
      return res.status(422).send({ errorMsg: info.errorMsg });
    }

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      console.log("\nSigned up as " + user.username);
      console.log("SESSION STARTED");

      let formattedUser = {
        username: user.username,
        email: user.email,
        _id: user._id,
        favoriteTeams: user.favoriteTeams,
      };

      return res.status(201).send({ user: formattedUser });
    });
  })(req, res, next);
});

//session is created on login
router.post("/login", isValidRequest, (req, res, next) => {
  passport.authenticate("login", (error, user, info) => {
    if (error) {
      console.log("\nLoginPassportAuthenticate Error: " + error);
      return res.status(500).send("Server error");
    }

    //user doesn't exist
    if (!user) {
      return res.status(422).send({ errorMsg: info.errorMsg });
    }

    //invalid password
    if (user === "invalid password") {
      return res.status(401).send({ errorMsg: info.errorMsg });
    }

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      console.log("\nLogged in as " + user.username);
      console.log("SESSION STARTED");

      let formattedUser = {
        username: user.username,
        email: user.email,
        _id: user._id,
        favoriteTeams: user.favoriteTeams,
      };

      return res.status(200).send({ user: formattedUser });
    });
  })(req, res, next);
});

router.post("/logout", function (req, res, next) {
  console.log("\nLogging out of " + req.user[0].username);

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });

  console.log("SESSION ENDED");
  res.sendStatus(200);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/auth/google/error",
    successRedirect: "http://localhost:3000/",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.send("Thank you");
  }
);

module.exports = router;
