 
 const express = require('express');
 const router = express.Router();
 const {addUser,getUser,deleteUser,login} = require('../controllers/usersController'); 
 console.log("hi from router.js");

 router.post('/', addUser);
 router.get('/:id', getUser);
 router.delete('/:id', deleteUser);
 router.post('/login', login);

 module.exports = router;