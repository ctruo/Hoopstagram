const express = require("express");
const Post = require("../schemas/Posts")
const User = require("../schemas/Users")
const Comment = require("../schemas/Comments")

const router = express.Router();


// GET Routes

router.get("/view/:id", async (req, res) => {
    //dont need auth here
    let id = req.params.id;
    const post = await Post.findById(id)

    const user = await User.findById(post.user)

    console.log(user.username)
    let author = user.username
    console.log(req.user)
    if (req.user)
    {
        ownpost = author === req.user[0].username
    }
    else ownpost = false

    let liked = false
    let disliked = false
    let k = 0
    if (req.user)
    {
        usersLiked = post.usersLiked
        for (k = 0; k < usersLiked.length; k++) {
            if (usersLiked[k].username == req.user[0].username) {
              liked = true
              break;
            }
        }
        usersDisliked = post.usersDisliked
        for (k = 0; k < usersDisliked.length; k++) {
            if (usersDisliked[k].username == req.user[0].username) {
              disliked = true
              break;
            }
        }
    }


    res.send({post, author, ownpost, liked, disliked})
});

router.get("/comments/:post", async (req, res) =>
{
    let id = req.params.post;
    // find post
    const post = await Post.findById(
        id
    )
    // find all comments
    const postComments = await Comment.find({post})
    let u = postComments.user
    const author = await User.findById(u)
    res.send(postComments)
});

// POST Routes


router.post("/create", async (req, res) => {
    if (req.user)
    {
        const { title, text } = req.body
        let usersLiked = []
        let usersDisliked = []
        const user = await User.findOne({
            username: req.user[0].username,
          });
        console.log(user)
        let likes = 0
        
        const newPost = new Post({title, text, user, usersLiked, usersDisliked, likes})
        await newPost.save();
        res.send({ msg: "CREATED POST!" });
    }
    else 
    {
        return res.status(401).send({ errorMsg:  "Try logging in first!"});
    }
});

// Create comment on post
router.post("/comment/:post", async (req, res) =>
{
    if (req.user)
    {
        const { text } = req.body
        let id = req.params.post;
        let username = req.user[0].username
        console.log(text)
        // find post
        const post = await Post.findById(
            id
        )
        console.log(post)

        const user = await User.findOne({
            username
          });
        console.log(text)
        console.log(user)
        console.log(post)
        const newComment = new Comment({text, username, user, post})
        await newComment.save();
        res.send({ msg: "CREATED POST!" });
    }
    else 
    {
        res.send({ msg: "NOT LOGGED IN" });
    }
});

// Like or Dislike Post
router.post("/like", async (req, res) => {
    if (req.user)
    {
        let f = false
        const { id } = req.body
        const user = await User.findOne({
            username: req.user[0].username,
        });
        const post = await Post.findById(id)
        usersLiked = post.usersLiked
        likes = post.likes
        for (let i = 0; i < usersLiked.length; i++) {
            if (usersLiked[i].username == req.user[0].username) {
              usersLiked.splice(i, 1);
              f = true;
              likes = likes - 1;
              break;
            }
          }

        usersDisliked = post.usersDisliked
        if (!f)
        {
            for (let k = 0; k < usersDisliked.length; k++) {
                if (usersDisliked[k].username == req.user[0].username) {
                  usersDisliked.splice(k, 1);
                  likes = likes + 1;
                  break;
                }
            }
            likes = likes + 1;
            usersLiked.push(user)
        }
        await Post.findByIdAndUpdate(id, {usersLiked, likes})
        await Post.findByIdAndUpdate(id, {usersDisliked, likes})

        res.send({msg: "LIKED"})
    }
});

router.post("/dislike", async (req, res) => {
    if (req.user)
    {
        let f = false
        const { id } = req.body
        const user = await User.findOne({
            username: req.user[0].username,
        });
        const post = await Post.findById(id)
        usersDisliked = post.usersDisliked
        likes = post.likes
        for (let i = 0; i < usersDisliked.length; i++) {
            if (usersDisliked[i].username == req.user[0].username) {
              usersDisliked.splice(i, 1);
              f = true;
              likes = likes + 1;
              break;
            }
          }

        usersLiked = post.usersLiked
        if (!f)
        {
            for (let k = 0; k < usersLiked.length; k++) {
                if (usersLiked[k].username == req.user[0].username) {
                  usersLiked.splice(k, 1);
                  likes = likes - 1;
                  break;
                }
            }
            likes = likes - 1;
            usersDisliked.push(user)
        }
        await Post.findByIdAndUpdate(id, {usersLiked, likes})
        await Post.findByIdAndUpdate(id, {usersDisliked, likes})

        res.send({msg: "DISLIKED"})

    }

});

// Delete post
router.delete("/delete", async (req, res) => {
    if (req.user)
    {
        const { id } = req.body
        const user = await User.findOne({
            username: req.user[0].username,
        });
        const post = await Post.findById(
            id
        )
        // check if user made post
        if (req.user)
        {
            await Post.findByIdAndDelete(id)
            res.redirect('/feed')
        }
        else
        {
            res.send({msg: "USER DID NOT CREATE POST"})
        }
    }
    else
    {
        res.send({msg: "NOT LOGGED IN"})
    }
});

module.exports = router;