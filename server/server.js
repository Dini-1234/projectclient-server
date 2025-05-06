const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config(); 

const db = require('./db.js'); 
console.log('המשתנה PORT:', process.env.PORT); // הוסיפי שורה זו
app.use(express.json());
// require('./cleanupService'); // הוסיפי שורה זו בתחילת server.js
console.log("hi from server.js");


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
