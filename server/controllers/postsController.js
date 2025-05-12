const postsBL = require('../BL/postsBL');

const addPosts = async (req, res) => {
  try {
    const post = await postsBL.addPost(req.body);
    console.log("hi from here "+post);
    
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const post = await postsBL.getPostById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllPosts = async (req, res) => {
    try {
        console.log("hi from controller.js");

      const post = await postsBL.getAllPosts(req.params.id);
      if (!post) return res.status(404).send('no posts found');
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
const editPosts = async (req, res) => {
  try {
    const updatedPost = await postsBL.editPost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePosts = async (req, res) => {
  try {
    await postsBL.deletePost(req.params.id);
    res.sendStatus(204); // No Content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addPosts, getPosts, editPosts, deletePosts,getAllPosts };
