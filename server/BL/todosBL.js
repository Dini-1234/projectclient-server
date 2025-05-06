const dal = require('../DAL/dal');

const addTodo = async (data) => {
  return await dal.genericPost('todos', data);
};

const getTodoById = async (id) => {
  return await dal.genericGetById('todos', id);
};

const editTodo = async (id, data) => {
  return await dal.genericUpdate('todos', id, data);
};

const deleteTodo = async (id) => {
  return await dal.genericDelete('todos', id);
};

module.exports = { addTodo, getTodoById, editTodo, deleteTodo };
