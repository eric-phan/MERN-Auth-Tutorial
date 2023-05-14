const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  getFeedPosts,
  deletePost,
  updatePost,
  uploadImg,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all Post routes
router.use(requireAuth);

// GET all posts
router.get("/", getPosts);

//GET a single post
// use this
router.get("/feed", getFeedPosts);
// feed infront of id to get all posts

router.get("/:id", getPost);
// if this is before it will treat everything below it as a parameter

// POST a new post
router.post("/", createPost);

// upload an image
router.post("/upload", uploadImg);

// DELETE a post
router.delete("/:id", deletePost);

// UPDATE a post
router.patch("/:id", updatePost);

module.exports = router;
