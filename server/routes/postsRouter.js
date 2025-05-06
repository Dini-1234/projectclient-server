const express = require('express');
const router = express.Router();
const {editPosts,addPosts,getPosts,deletePosts,getAllPosts} = require('../controllers/postsController');
console.log("hi from router.js");

router.put('/:id', editPosts);
router.post('/', addPosts);
router.get('/', getAllPosts);
router.get('/:id', getPosts);
router.delete('/:id', deletePosts);

module.exports = router;