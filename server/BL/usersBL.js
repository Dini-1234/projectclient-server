const dal = require('../DAL/dal');

const addUser = async (data) => {
  return await dal.genericPost('users', data);
};

const getUserById = async (id) => {
  return await dal.genericGetById('users', id);
};

const editUser = async (id, data) => {
  return await dal.genericUpdate('users', id, data);
};

const deleteUser = async (id) => {
  return await dal.genericDelete('users', id);
};

module.exports = { addUser, getUserById, editUser, deleteUser };

