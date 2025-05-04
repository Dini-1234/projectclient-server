const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const db = require('./DB/db.js'); // נתיב לקובץ חיבור

require('dotenv').config(); // טוען את .env

// מאפשר קבלת בקשות JSON
app.use(express.json());

const initDatabase = require('..DB/initDb');
initDatabase(); 
// דוגמה לנתיב GET
app.get('/', (req, res) => {
  res.send('השרת פועל!');
});

// דוגמה לנתיב POST
app.post('/api/data', (req, res) => {
  console.log('קיבלתי:', req.body);
  res.json({ message: 'קיבלתי את המידע!' });
});

app.listen(process.env.PORT, () => {
  console.log(`השרת מאזין על http://localhost:${5000}`);
});
