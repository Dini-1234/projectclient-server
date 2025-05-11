const express = require('express');
const router = express.Router();
const {editComments,addComments,getComments,deleteComments} = require('../controllers/commentsController'); // או supplierController אם את משאירה את זה שם

router.put('/:id', editComments);
router.get('/', getComments);
router.delete('/:id', deleteComments);
router.post('/', addComments); // רק למי שיש טוקן

module.exports = router;