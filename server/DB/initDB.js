// db/initDB.js

require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // יוצרים את הדאטאבייס אם לא קיים
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log('✅ Database created or already exists');

    // משתמשים בדאטאבייס
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    // יוצרים טבלאות (תוכלי להוסיף עוד)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100)
      )
    `);
    console.log('✅ Table "users" created');

    await connection.end();
    console.log('🎉 Initialization finished');

  } catch (err) {
    console.error('❌ Error initializing DB:', err);
  }
}

initDatabase();
