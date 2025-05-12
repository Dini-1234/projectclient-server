const todosBL = require('../BL/todosBL');

const addTodos = async (req, res) => {
  try {
    const todo = await todosBL.addTodo(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await todosBL.getTodosByUserId(req.params.id); 
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const editTodos = async (req, res) => {
  try {
    const updatedTodo = await todosBL.editTodo(req.params.id, req.body);
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTodos = async (req, res) => {
  try {
    await todosBL.deleteTodo(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addTodos, getTodos, editTodos, deleteTodos };
