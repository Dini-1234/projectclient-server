const dal = require('../DAL/dal');

const addComment = async (data) => {
  return await dal.genericPost('comments', data);
};

const getCommentById = async (id) => {
  return await dal.genericGetById('comments', id);
};

const editComment = async (id, data) => {
  return await dal.genericUpdate('comments', id, data);
};

const deleteComment = async (id) => {
  return await dal.genericDelete('comments', id);
};

module.exports = { addComment, getCommentById, editComment, deleteComment };
