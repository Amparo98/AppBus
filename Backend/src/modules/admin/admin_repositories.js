const { pool } = require('../../config/db');

async function getAdminByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id_admin, email, password_hash FROM admin WHERE email = $1 LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function getPendingCompanies() {
  const { rows } = await pool.query(
    `SELECT id_company, name_company, email, created_at
     FROM company WHERE status = 'pending' ORDER BY created_at ASC`
  );
  return rows;
}

async function approveCompany(id_company, activation_token) {
  const { rows } = await pool.query(
    `UPDATE company SET status = 'approved', activation_token = $2
     WHERE id_company = $1 AND status = 'pending'
     RETURNING id_company, name_company, email`,
    [id_company, activation_token]
  );
  return rows[0] || null;
}

async function rejectCompany(id_company) {
  const { rows } = await pool.query(
    `UPDATE company SET status = 'rejected'
     WHERE id_company = $1 AND status = 'pending'
     RETURNING id_company, name_company, email`,
    [id_company]
  );
  return rows[0] || null;
}

module.exports = { getAdminByEmail, getPendingCompanies, approveCompany, rejectCompany };