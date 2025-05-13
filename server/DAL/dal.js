const { ko } = require('@faker-js/faker');
const pool = require('../db.js'); 


const genericPost = async (collectionName, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO \`${collectionName}\` (${keys.join(', ')}) VALUES (${placeholders})`;
  const [result] = await pool.query(sql, values);
  const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE id = ?`, [result.insertId]);
  return rows[0]; 
};

const genericGetById = async (collectionName, id) => {
  const sql = `
    SELECT * FROM \`${collectionName}\`
    WHERE id = ? AND (is_deleted IS NULL OR is_deleted = FALSE)
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
};

const getCommentsByPostId = async (collectionName, postId) => {
  const sql = `
    SELECT * FROM \`${collectionName}\`
    WHERE post_id = ? AND (is_deleted IS NULL OR is_deleted = FALSE)
  `;
  const [rows] = await pool.query(sql, [postId]);
  return rows;
};

const genericUpdate = async (collectionName, id, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const assignments = keys.map(key => `\`${key}\` = ?`).join(', ');
  const sqlUpdate = `
    UPDATE \`${collectionName}\`
    SET ${assignments}
    WHERE id = ?
  `;
  const [updateResult] = await pool.query(sqlUpdate, [...values, id]);
  if (updateResult.affectedRows > 0) {
    const sqlSelect = `SELECT * FROM \`${collectionName}\` WHERE id = ?`;
    const [rows] = await pool.query(sqlSelect, [id]);
    return rows[0]; 
  }
  return null;
};
const genericDelete = async (collectionName, id) => {
  const sql = `
    UPDATE \`${collectionName}\`
    SET is_deleted = TRUE
    WHERE id = ?
  `;
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
};

const genericGetAll = async (collectionName) => {
  const sql = `
    SELECT * FROM \`${collectionName}\`
    WHERE is_deleted IS NULL OR is_deleted = FALSE
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

const genericGetByForeignKey = async (collectionName, foreignKeyName, value) => {
  const sql = `
    SELECT * FROM \`${collectionName}\`
    WHERE \`${foreignKeyName}\` = ? AND (is_deleted IS NULL OR is_deleted = FALSE)
  `;
  const [rows] = await pool.query(sql, [value]);
  return rows;
};

const genericDeleteWithCascade = async (collectionName, id, caseCode) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE \`${collectionName}\` SET is_deleted = TRUE WHERE id = ?`,
      [id]
    );

    if (caseCode === 'DELETE_POST') {
      await connection.query(
        `UPDATE comments SET is_deleted = TRUE WHERE post_id = ?`,
        [id]
      );
    }
    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error in genericDeleteWithCascade:', err);
    return false;
  } finally {
    connection.release();
  }
};
// const createUser = async (user, passwordHash) => {
//   const conn = await pool.getConnection();
//   try {
//       await conn.beginTransaction();
//       const insertUserSQL = `
//           INSERT INTO users (name, username, email, phone)
//           VALUES (?, ?, ?, ?)
//       `;
//       await conn.query(insertUserSQL, [
//           user.name,
//           user.username,
//           user.email,
//           user.phone
//       ]);
//       const [rows] = await conn.query('SELECT LAST_INSERT_ID() AS user_id');
//       const userId = rows[0].user_id;
//       const insertCredentialsSQL = `
//           INSERT INTO credentials (user_id, password_hash)
//           VALUES (?, ?)
//       `;
//       await conn.query(insertCredentialsSQL, [userId, passwordHash]);

//       await conn.commit();
//       console.log(userId);
//       return { success: true,id:userId };
//   } catch (error) {
//       await conn.rollback();
//       throw error;
//   } finally {
//       conn.release();
//   }
// };
const createUser = async (user, passwordHash) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    const insertUserSQL = `
      INSERT INTO users (name, username, email, phone)
      VALUES (?, ?, ?, ?)
    `;
    await conn.query(insertUserSQL, [
      user.name,
      user.username,
      user.email,
      user.phone
    ]);

    const [rows] = await conn.query('SELECT LAST_INSERT_ID() AS user_id');
    const userId = rows[0].user_id;

    const insertCredentialsSQL = `
      INSERT INTO credentials (user_id, password_hash)
      VALUES (?, ?)
    `;
    await conn.query(insertCredentialsSQL, [userId, passwordHash]);

    // שליפה של כל האובייקט `users`
    const [userRows] = await conn.query(`
      SELECT * FROM users WHERE id = ?
    `, [userId]);

    await conn.commit();
      console.log(userRows[0]);
      
    return { success: true, user: userRows[0] };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const getUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await pool.query(sql, [username]);
  return rows[0]; 
}
const getCredentialsByUserId = async (userId) => {
  const sql = 'SELECT * FROM credentials WHERE user_id = ?';
  const [rows] = await pool.query(sql, [userId]);
  return rows[0]; 
};


module.exports = {
  genericPost,
  genericGetById,
  genericUpdate,
  genericDelete,
  genericGetAll,
  genericGetByForeignKey,
  genericDeleteWithCascade,
  createUser,
  getCommentsByPostId,
  getUserByUsername,
  getCredentialsByUserId
};

