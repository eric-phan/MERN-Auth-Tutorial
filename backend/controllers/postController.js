const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/postModel");
const mongoose = require("mongoose");

// get all users' posts
const getPosts = async (req, res) => {
  const user_id = req.user._id;
  // gets the user id

  const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
  // find based on user id, only by the currently logged in user

  res.status(200).json(posts);
};
// get feed posts
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: "desc" }).lean();
    // console.log("post");
    // console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// get a single post
const getPost = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// create new post
const createPost = async (req, res) => {
  const { title, reps, caption } = req.body;
  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  // if (!image) {
  //   emptyFields.push("image");
  // }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!caption) {
    emptyFields.push("caption");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    // upload img
    console.log(user.body);
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "postsMERN",
    });
    const post = await Post.create({
      title,
      image: uploadResponse.secure_url,
      reps,
      caption,
      user_id,
    });
    console.log(uploadResponse);
    console.log(post);
    // adding the user_id to the document
    res.status(200).json(post);
    res.json({ msg: "Uploaded!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadImg = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "postsMERN",
    });
    console.log(uploadResponse);

    // what we get back frm cloudinary
    console.log(uploadResponse.secure_url);
    res.json({ msg: "Uploaded!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
};
// try {
//   if (image) {
//     const uploadedResponse = await cloudinary.uploader.upload(image, {
//       upload_preset: "postsMERN",
//     });
//     if (uploadedResponse) {
//       const user_id = req.user._id;
//       const post = await Post.create({
//         title,
//         image,
//         reps,
//         caption,
//         user_id,
//       });
//       console.log(post);
//       // adding the user_id to the document
//       res.status(200).json(post);
//       const savedPost = await post.save();
//       res.status(200).send(savedPost);
//     }
//   }
// }
// catch (error) {
//   res.status(400).json({ error: error.message });
//   }
// };

// delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndDelete({ _id: id });

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// update a post
const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  getFeedPosts,
  uploadImg,
};
