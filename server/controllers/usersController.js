const jwt = require('jsonwebtoken');
const usersBL = require('../BL/usersBL');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
  try {
    console.log(req.body);
    const { password, ...userData } = req.body; // הוצאנו את הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10); // גיבוב הסיסמה
    const user = await usersBL.addUser(userData, hashedPassword);
    res.json(user); // אם הכל תקין, מחזירים את המשתמש
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  console.log("Login function called");

  try {
    const { username, password } = req.body;
    const user = await usersBL.getUserByUsername(username);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const credentials = await usersBL.getCredentialsByUserId(user.id);
    if (!credentials) return res.status(403).json({ message: 'No credentials found' });
    console.log(password, credentials.password_hash)
    const isPasswordCorrect = await bcrypt.compare(password, credentials.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json(user); // אם הכל תקין, מחזירים את המשתמש
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

module.exports = { addUser, getUser, editUser, deleteUser, login };
