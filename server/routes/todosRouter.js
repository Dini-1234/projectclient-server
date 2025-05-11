const express = require('express');
const router = express.Router();
const {editTodos,addTodos,getTodos,deleteTodos} = require('../controllers/todosController'); 

router.put('/', editTodos);
router.post('/', addTodos);
router.get('/', getTodos);
router.delete('/', deleteTodos);

module.exports = router;