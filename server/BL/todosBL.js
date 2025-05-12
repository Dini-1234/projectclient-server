const dal = require('../DAL/dal');

const addTodo = async (data) => {
  return await dal.genericPost('tasks', data);
};

// מחזיר את כל הטודואים לפי user_id
const getTodosByUserId = async (userId) => {
  return await dal.genericGetByForeignKey('tasks', 'user_id', userId);
};

const editTodo = async (id, data) => {
  return await dal.genericUpdate('tasks', id, data);
};

const deleteTodo = async (id) => {
  return await dal.genericDelete('tasks', id);
};

module.exports = { addTodo, getTodosByUserId, editTodo, deleteTodo };
