const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usersLiked: {
    type: Array,
    required: true,
  },
  usersDisliked: {
    type: Array,
    required: true,
  },
  likes:
  {
    type: Number,
    required: true,
  }
},
{
    timestamps: true,
}

);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
