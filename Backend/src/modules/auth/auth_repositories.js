const { pool } = require('../../config/db');

async function getClientByEmail(email) {
  const query = `
    SELECT id_client, full_name, first_surname, second_surname, email, password_hash
    FROM client
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function getCompanyByEmail(email) {
  const query = `
    SELECT id_company, name_company, email, password_hash 
    FROM company
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function getDriverByEmail(email) {
  const query = `
    SELECT id_driver, full_name, first_surname, second_surname, email, password_hash,
            employee_number, is_account_activated, is_active
    FROM driver
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

// para registro 
async function createClient(fullName, firstSurname, secondSurname, email, passwordHash) {
  const query = `
    INSERT INTO client (full_name, first_surname, second_surname, email, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_client, full_name, first_surname, second_surname, email
  `;

  const values = [fullName, firstSurname, secondSurname, email, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function createCompany(nameCompany, email) {
  const query = `
    INSERT INTO company (name_company, email, status)
    VALUES ($1, $2, 'pending')
    RETURNING id_company, name_company, email, status
  `;
  const { rows } = await pool.query(query, [nameCompany, email]);
  return rows[0];
}

async function getCompanyByToken(token) {
  const query = `
    SELECT id_company, name_company, email, status
    FROM company
    WHERE activation_token = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [token]);
  return rows[0] || null;
}

async function activateCompany(id_company, password_hash) {
  const query = `
    UPDATE company
    SET password_hash = $1, status = 'active', activation_token = NULL
    WHERE id_company = $2 AND status = 'approved'
    RETURNING id_company, name_company, email, status
  `;
  const { rows } = await pool.query(query, [password_hash, id_company]);
  return rows[0] || null;
}


async function existsClientByEmail(email) {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM client WHERE email = $1
        ) AS exists
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0].exists;
}

async function existsCompanyByEmail(email) {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM company WHERE email = $1
        ) AS exists
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0].exists;
}

module.exports = {
  getClientByEmail,
  getCompanyByEmail,
  getDriverByEmail,
  createClient,
  createCompany,
  getCompanyByToken,
  activateCompany,
  existsClientByEmail,
  existsCompanyByEmail
};