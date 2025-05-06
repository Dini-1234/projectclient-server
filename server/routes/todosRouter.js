const express = require('express');
const router = express.Router();
const {editTodos,addTodos,getTodos,deleteTodos} = require('../controllers/todosController'); 

router.put('/:id', editTodos);
router.post('/', addTodos);
router.get('/:id', getTodos);
router.delete('/:id', deleteTodos);

module.exports = router;