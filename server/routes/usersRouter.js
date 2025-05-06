 
 const express = require('express');
 const router = express.Router();
 const {addUser,login,deleteUser} = require('../controllers/usersController'); 
 
 router.post('/', addUser);
 router.get('/:id', login);
 router.delete('/:id', deleteUser);
 
 module.exports = router;