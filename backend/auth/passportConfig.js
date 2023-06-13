const LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const User = require("../schemas/Users");

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.find({ _id: id });

    if (user) {
      done(null, user);
    }
  });

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async function (
      username,
      password,
      done
    ) {
      try {
        const user = await User.find({ email: username });

        //no account with specified username
        if (user.length < 1) {
          return done(null, false, { errorMsg: "Account doesn't exist!" });
        } else if (user[0].googleId) {
          return done(null, false, {
            errorMsg: "Email registered through Google already!",
          });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        //account found, invalid password
        if (!validPassword) {
          return done(null, "invalid password", {
            errorMsg: "Invalid password!",
          });
        }

        return done(null, user[0]);
      } catch (error) {
        console.log("Login LocalStrategy Error: " + error);
        return done(error, false);
      }
    })
  );

  passport.use(
    "signup",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async function (req, username, password, done) {
        try {
          console.log(username);
          const emailCheck = await User.find({ email: username });

          //email is taken
          if (emailCheck.length > 0) {
            if (emailCheck[0].googleId) {
              return done(null, false, {
                errorMsg: "Email registered through Google!",
              });
            }
            return done(null, false, {
              errorMsg: "Email is already taken!",
            });
          }

          //input is valid
          else {
            //hash password
            let saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            //create user and save to MongoDB
            const newUser = await User.create({
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword,
            });

            return done(null, newUser);
          }
        } catch (error) {
          console.log("Signup LocalStrategy Error: " + error);
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await User.find({ googleId: profile.id });

        try {
          //existing user found, return it
          if (user && user[0]) {
            console.log("\nLogged in with Google as " + user[0].username);
            console.log("SESSION STARTED");

            return done(null, user && user[0]);
          }

          //no user found, create it
          const newUser = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });

          console.log("\nSigned up with Google as " + profile.displayName);
          console.log("SESSION STARTED");

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
