const express = require('express');
const router = express.Router();
const {editPosts,addPosts,getPosts,deletePosts} = require('../controllers/postsController'); // או supplierController אם את משאירה את זה שם

router.put('/:id', editPosts);
router.post('/', addPosts);
router.get('/:id', getPosts);
router.delete('/:id', deletePosts);

module.exports = router;