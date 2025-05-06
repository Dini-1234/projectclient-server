const pool = require('../db.js);'); 

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

module.exports = {
  genericPost,
  genericGetById,
  genericUpdate,
  genericDelete,
  genericGetAll,
  genericGetByForeignKey,
  genericDeleteWithCascade,
};

