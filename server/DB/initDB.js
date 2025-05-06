// db/initDB.js

require('dotenv').config();
const pool = require('./db'); // מניח שה-pool שלך מיובא מהקובץ שכתבת קודם

async function createTables() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // אפשרות: מחיקת טבלאות אם קיימות
    const dropTables = `
      DROP TABLE IF EXISTS comments, posts, tasks, credentials, companies, addresses, users;
    `;
    await connection.query(dropTables);

    // יצירת טבלת users
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100),
        phone VARCHAR(50),
        website VARCHAR(100)
      );
    `);

    // טבלת addresses
    await connection.query(`
      CREATE TABLE addresses (
        user_id INT,
        street VARCHAR(100),
        suite VARCHAR(50),
        city VARCHAR(50),
        zipcode VARCHAR(20),
        lat VARCHAR(20),
        lng VARCHAR(20),
        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // טבלת companies
    await connection.query(`
      CREATE TABLE companies (
        user_id INT,
        name VARCHAR(100),
        catch_phrase VARCHAR(255),
        bs VARCHAR(100),
        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // טבלת credentials
    await connection.query(`
      CREATE TABLE credentials (
        user_id INT PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // טבלת posts
    await connection.query(`
      CREATE TABLE posts (
        id INT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        body TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // טבלת comments
    await connection.query(`
      CREATE TABLE comments (
        id INT PRIMARY KEY,
        post_id INT,
        name VARCHAR(100),
        email VARCHAR(100),
        body TEXT,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    // טבלת tasks
    await connection.query(`
      CREATE TABLE tasks (
        id INT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        completed BOOLEAN,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await connection.commit();
    console.log('✅ Tables created successfully.');
  } catch (err) {
    await connection.rollback();
    console.error('❌ Failed to create tables:', err);
  } finally {
    connection.release();
  }
}

createTables();
await pool.end();

