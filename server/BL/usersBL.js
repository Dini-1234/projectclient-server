const dal = require('../DAL/dal');

const addUser = async (user, passwordHash) => {
  return await dal.createUser(user, passwordHash);
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
const getUserByUsername = async (username) => {
  return await dal.getUserByUsername(username);
};

const getCredentialsByUserId = async (userId) => {
  return await dal.getCredentialsByUserId(userId);
};


module.exports = { 
  addUser,
  getUserById,
  editUser,
  deleteUser,
  getUserByUsername,
  getCredentialsByUserId};

