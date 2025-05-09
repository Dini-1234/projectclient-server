import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';
import mysql from 'mysql2/promise';

// קוד שמאפשר שימוש ב__dirname ב-ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// טוענים את הקובץ .env מתוך התיקיה הראשית
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log('DB_USER:', process.env.DB_USER);
const dbName = 'project3DB'; // ← השם של בסיס הנתונים שלך

let connection; // משתנה גלובלי

async function createDatabaseAndConnect() {
  try {
    // מתחברים בלי לציין database, כדי ליצור אותו
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Dini327855318',
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
    id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100),
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100),
        phone VARCHAR(50),
        password VARCHAR(100),
        is_deleted BOOLEAN DEFAULT FALSE
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
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        title VARCHAR(255),
        body TEXT,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createComments = `
      CREATE TABLE comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
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
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        title VARCHAR(255),
        completed BOOLEAN,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const fullSQL = dropTables + createUsers + createCredentials + createPosts + createComments + createTasks;

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



async function seedData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
  });

  try {
    console.log('🔄 Seeding started...');
    await connection.beginTransaction();

    const userIds = [];

    // יצירת משתמשים + סיסמאות
    for (let i = 0; i < 5; i++) {
      const name = faker.person.fullName();
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const phone = faker.phone.number();
      const password = faker.internet.password();
      const password_hash = faker.string.alphanumeric(60); // אפשר לשלב עם bcrypt בעתיד

      const [userResult] = await connection.query(
        `INSERT INTO users (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)`,
        [name, username, email, phone, password]
      );

      const userId = userResult.insertId;
      userIds.push(userId);

      await connection.query(
        `INSERT INTO credentials (user_id, password_hash) VALUES (?, ?)`,
        [userId, password_hash]
      );

      // יצירת פוסטים
      for (let j = 0; j < 5; j++) {
        const title = faker.lorem.sentence();
        const body = faker.lorem.paragraphs(2);

        const [postResult] = await connection.query(
          `INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)`,
          [userId, title, body]
        );
        // ✅ יצירת משימות
        for (let m = 0; m < 5; m++) {
          const taskTitle = faker.lorem.sentence();
          const completed = faker.datatype.boolean();

          await connection.query(
            `INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, ?)`,
            [userId, taskTitle, completed]
          );
        }
        const postId = postResult.insertId;

        // יצירת הערות – המגיבים נבחרים רנדומלית מתוך המשתמשים הקיימים
        for (let k = 0; k < 3; k++) {
          const commenterName = faker.person.fullName();
          const commenterEmail = faker.internet.email();
          const commentBody = faker.lorem.sentences(2);

          await connection.query(
            `INSERT INTO comments (post_id, name, email, body) VALUES (?, ?, ?, ?)`,
            [postId, commenterName, commenterEmail, commentBody]
          );
        }
      }
    }

    await connection.commit();
    console.log('✅ Dummy data seeded successfully.');
  } catch (err) {
    await connection.rollback();
    console.error('❌ Seeding failed:', err);
  } finally {
    await connection.end();
  }
}



async function main() {
  await createDatabaseAndConnect();
  await createTables();
  await seedData();
}

main();
