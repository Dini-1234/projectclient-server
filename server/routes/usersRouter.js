 
 const express = require('express');
 const router = express.Router();
 const {addUser,getUser,deleteUser} = require('../controllers/usersController'); 
 router.post('/', addUser);
 router.get('/:id', getUser);
 router.delete('/:id', deleteUser);
 
 module.exports = router;