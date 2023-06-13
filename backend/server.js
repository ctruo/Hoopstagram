//-------------------Imports-------------------//
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const statsRoutes = require("./routes/statsRoutes");
//-------------------END Imports-------------------//

app = express();

//-------------------Middleware-------------------//
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, //expires in 1 hour,
  })
);

require("./auth/passportConfig")(passport);
app.use(passport.initialize());
app.use(passport.session());
//-------------------END Middleware-------------------//

//-------------------Routes-------------------//
//Authentication routes for signup and login
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/stats", statsRoutes);
//-------------------END Routes-------------------//

//host app and then connect to MongoDB
app.listen(5000, () => {
  console.log("Server running on port 5000");

  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((error) => {
      console.log("DB CONNECTION ERROR: " + error);
    });
});
