const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const db = require('./db.js'); 
require('dotenv').config(); 
app.use(express.json());


const postsRoutes = require('./routes/postsRoutes');
const todosRoutes = require('./routes/todosRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use('/api/posts', postsRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`השרת מאזין על http://localhost:${5000}`);
});
