const dal = require('../DAL/dal');

const addTodo = async (data) => {
  return await dal.genericPost('tasks', data);
};

const getTodoById = async (id) => {
  return await dal.genericGetById('tasks', id);
};

const editTodo = async (id, data) => {
  return await dal.genericUpdate('tasks', id, data);
};

const deleteTodo = async (id) => {
  return await dal.genericDelete('tasks', id);
};

module.exports = { addTodo, getTodoById, editTodo, deleteTodo };
