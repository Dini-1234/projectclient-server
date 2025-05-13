const pool = require('./db');
const cron = require('node-cron');
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

cron.schedule('0 1 1 * *', () => {
  runCleanup();
});

module.exports = {
  runCleanup, 
};
