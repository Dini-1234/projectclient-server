 
 const express = require('express');
 const router = express.Router();
 const {addUser,getUser,deleteUser} = require('../controllers/usersController'); 
 console.log("hi from router.js");

 router.post('/', addUser);
 router.get('/:id', getUser);
 router.delete('/:id', deleteUser);
 
 module.exports = router;