const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    allowNull: true,
  },
  password: {
    type: String,
    min: 2,
    allowNull: true,
  },
  googleId: {
    type: String,
    allowNull: true,
  },
  favoriteTeams: [{ type: String }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
