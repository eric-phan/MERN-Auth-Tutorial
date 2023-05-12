const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  getFeedPosts,
  deletePost,
  updatePost,
  storeImage,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all Post routes
router.use(requireAuth);

// GET all posts
router.get("/", getPosts);

//GET a single post
// use this
router.get("/:id", getPost);

router.get("/feed", getFeedPosts);

// POST a new post
router.post("/", createPost);

// POST storeimage
router.post("/store-image", storeImage);

// DELETE a post
router.delete("/:id", deletePost);

// UPDATE a post
router.patch("/:id", updatePost);

module.exports = router;
