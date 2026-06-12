const { pool } = require('../../config/db');

async function getClientById(client_id) {
  const { rows } = await pool.query(
    `SELECT id_client, full_name, first_surname, second_surname, email, avatar_url, created_at
     FROM client WHERE id_client = $1`,
    [client_id]
  );
  return rows[0] || null;
}

async function updateClient(client_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE client SET ${setClause}
     WHERE id_client = $${keys.length + 1}
     RETURNING id_client, full_name, first_surname, second_surname, email, avatar_url`,
    [...values, client_id]
  );
  return rows[0] || null;
}

async function updatePassword(client_id, password_hash) {
  const { rows } = await pool.query(
    `UPDATE client SET password_hash = $1
     WHERE id_client = $2
     RETURNING id_client`,
    [password_hash, client_id]
  );
  return rows[0] || null;
}

async function existsEmailForOtherClient(email, client_id) {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT 1 FROM client WHERE email = $1 AND id_client != $2
    ) AS exists`,
    [email, client_id]
  );
  return rows[0].exists;
}

module.exports = { 
  getClientById, 
  updateClient, 
  updatePassword,
  existsEmailForOtherClient
};