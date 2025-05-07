const dal = require('../DAL/dal');

const addComment = async (data) => {
  return await dal.genericPost('comments', data);
};

const getCommentsByPostId = async (id) => {
  return await dal.getCommentsByPostId('comments', id);
};

const editComment = async (id, data) => {
  return await dal.genericUpdate('comments', id, data);
};

const deleteComment = async (id) => {
  return await dal.genericDelete('comments', id);
};

module.exports = { addComment, getCommentsByPostId, editComment, deleteComment };
