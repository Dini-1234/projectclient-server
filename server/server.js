const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const db = require('./db.js'); 
require('dotenv').config(); 
console.log('המשתנה PORT:', process.env.PORT); // הוסיפי שורה זו
app.use(express.json());
require('./cleanupService'); // הוסיפי שורה זו בתחילת server.js


const postsRoutes = require('./routes/postsRouter');
const todosRoutes = require('./routes/todosRouter');
const commentsRoutes = require('./routes/commentsRouter');
const usersRoutes = require('./routes/usersRouter');

app.use('/api/posts', postsRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`השרת מאזין על http://localhost:${5000}`);
});
