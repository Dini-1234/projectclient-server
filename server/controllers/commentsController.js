const commentsBL = require('../BL/commentsBL');

const addComments = async (req, res) => {
  try {
    const comment = await commentsBL.addComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.query;
    const comment = await commentsBL.getCommentsByPostId(postId);
    if (!comment) return res.status(404).send('Comment not found');
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editComments = async (req, res) => {
  try {
    const updatedComment = await commentsBL.editComment(req.params.id, req.body);
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComments = async (req, res) => {
  try {
    await commentsBL.deleteComment(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addComments, getComments, editComments, deleteComments };
