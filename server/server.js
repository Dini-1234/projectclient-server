// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const postsRouter = require('./routes/postsRouter');
const todosRouter = require('./routes/todosRouter');
const commentsRouter = require('./routes/commentsRouter');
const usersRouter = require('./routes/usersRouter');

// Base Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/todos', todosRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
