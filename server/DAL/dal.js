const pool = require('../db.js'); 

const genericPost = async (collectionName, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');

  const sql = `INSERT INTO \`${collectionName}\` (${keys.join(', ')}) VALUES (${placeholders})`;

  const [result] = await pool.query(sql, values);
  return result.insertId;
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

  const sql = `
    UPDATE \`${collectionName}\`
    SET ${assignments}
    WHERE id = ?
  `;
  const [result] = await pool.query(sql, [...values, id]);
  return result.affectedRows > 0;
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

    // אפשר להוסיף כאן עוד caseCode בעתיד

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
const createUser = async (user, passwordHash) => {
  const conn = await pool.getConnection();
  try {
      await conn.beginTransaction();

      // users
      const insertUserSQL = `
          INSERT INTO users (name, username, email, phone, password)
          VALUES (?, ?, ?, ?, ?)
      `;
      await conn.query(insertUserSQL, [
          user.name,
          user.username,
          user.email,
          user.phone,
          user.password
      ]);

      // קבלת ה-ID שנוצר עבור המשתמש
      const [rows] = await conn.query('SELECT LAST_INSERT_ID() AS user_id');
      const userId = rows[0].user_id;

      // addresses
      const insertAddressSQL = `
          INSERT INTO addresses (user_id, street, suite, city, zipcode, lat, lng)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await conn.query(insertAddressSQL, [
          userId,  // השתמש ב-userId שנמצא
          user.address.street,
          user.address.suite,
          user.address.city,
          user.address.zipcode,
          user.address.geo.lat,
          user.address.geo.lng
      ]);

      // companies
      const insertCompanySQL = `
          INSERT INTO companies (user_id, \`name\`, catch_phrase, bs)
          VALUES (?, ?, ?, ?)
      `;
      await conn.query(insertCompanySQL, [
          userId,  // השתמש ב-userId שנמצא
          user.company.name,
          user.company.catchPhrase,
          user.company.bs
      ]);

      // credentials
      const insertCredentialsSQL = `
          INSERT INTO credentials (user_id, password_hash)
          VALUES (?, ?)
      `;
      await conn.query(insertCredentialsSQL, [userId, passwordHash]);

      await conn.commit();
      return { success: true };
  } catch (error) {
      await conn.rollback();
      throw error;
  } finally {
      conn.release();
  }
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
  getCommentsByPostId
};

