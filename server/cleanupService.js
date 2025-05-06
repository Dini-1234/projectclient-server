const pool = require('./db');
const cron = require('node-cron');

// טבלת שמות שאותם נרצה לנקות
const deletableTables = ['posts', 'comments', 'tasks'];

const runCleanup = async () => {
  try {
    console.log('🧹 Running cleanup task...');

    for (const table of deletableTables) {
      const sql = `DELETE FROM \`${table}\` WHERE is_deleted = TRUE`;
      const [result] = await pool.query(sql);
      console.log(`✅ Cleaned ${result.affectedRows} rows from ${table}`);
    }

  } catch (err) {
    console.error('❌ Error during cleanup:', err);
  }
};

// תזמון – כל חודש בלילה בין הראשון לשני (למשל ב-01:00)
cron.schedule('0 1 1 * *', () => {
  runCleanup();
});

module.exports = {
  runCleanup, // למקרה שתרצי להפעיל גם ידנית
};
