const jwt = require('jsonwebtoken');





const usersBL = require('../BL/usersBL');

const addUser = async (req, res) => {
  try {
    const user = await usersBL.addUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await usersBL.getUserById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const editUser = async (req, res) => {
  try {
    const updatedUser = await usersBL.editUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await usersBL.deleteUser(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addUser, getUser, editUser, deleteUser };
