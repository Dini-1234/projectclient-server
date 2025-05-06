import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// קוד שמאפשר שימוש ב__dirname ב-ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// טוענים את הקובץ .env מתוך התיקיה הראשית
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log('DB_USER:', process.env.DB_USER);

import mysql from 'mysql2/promise';

const dbName = 'project3DB'; // ← השם של בסיס הנתונים שלך

let connection; // משתנה גלובלי

async function createDatabaseAndConnect() {
  try {
    // מתחברים בלי לציין database, כדי ליצור אותו
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST||'localhost',
      user: process.env.DB_USER||'root',
      password: process.env.DB_PASSWORD||'Dini327855318',
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database ${dbName} created or already exists.`);
    await tempConnection.end();

    // מתחברים שוב - הפעם לבסיס הנתונים עצמו
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
      multipleStatements: true, // כדי להריץ כמה שאילתות ברצף
    });

  } catch (err) {
    console.error('❌ Failed to create database:', err);
    process.exit(1); // עצירה במקרה של שגיאה
  }
}

async function createTables() {
  try {
    await connection.beginTransaction();

    const dropTables = `
      DROP TABLE IF EXISTS comments, posts, tasks, credentials, companies, addresses, users;
    `;

    const createUsers = `
      CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100),
        phone VARCHAR(50),
        website VARCHAR(100)
      );
    `;

    const createAddresses = `
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
    `;

    const createCompanies = `
      CREATE TABLE companies (
        user_id INT,
        name VARCHAR(100),
        catch_phrase VARCHAR(255),
        bs VARCHAR(100),
        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createCredentials = `
      CREATE TABLE credentials (
        user_id INT PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createPosts = `
      CREATE TABLE posts (
        id INT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        body TEXT,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createComments = `
      CREATE TABLE comments (
        id INT PRIMARY KEY,
        post_id INT,
        name VARCHAR(100),
        email VARCHAR(100),
        body TEXT,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `;

    const createTasks = `
      CREATE TABLE tasks (
        id INT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        completed BOOLEAN,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const fullSQL = dropTables + createUsers + createAddresses + createCompanies + createCredentials + createPosts + createComments + createTasks;

    await connection.query(fullSQL);
    await connection.commit();

    console.log('✅ Tables created successfully.');

  } catch (err) {
    await connection.rollback();
    console.error('❌ Failed to create tables:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function main() {
  await createDatabaseAndConnect();
  await createTables();
}

main();
