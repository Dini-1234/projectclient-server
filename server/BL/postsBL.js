const dal = require('../DAL/dal');

const addPost = async (data) => {
  return await dal.genericPost('posts', data);
};

const getPostById = async (id) => {
  return await dal.genericGetById('posts', id);
};

const getAllPosts = async (id) => {
    return await dal.genericGetAll('posts');
  };
const editPost = async (id, data) => {
  return await dal.genericUpdate('posts', id, data);
};

const deletePost = async (id) => {
  return await dal.genericDeleteWithCascade('posts', id);
};

module.exports = { addPost, getPostById, editPost, deletePost, getAllPosts };
