const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password
});

async function testDbConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL conectado:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Error conectando con PostgreSQL:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testDbConnection
};