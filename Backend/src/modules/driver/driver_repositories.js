const { pool } = require('../../config/db.js');
const { generateDriverCode } = require('../../utils/codeDriver.js');

async function getDriverByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT id_driver, full_name, first_surname, second_surname, company_email,
     dni, phone_number, employee_number, is_account_activated, is_active, created_at
     FROM driver WHERE company_id = $1 ORDER BY created_at DESC`,
    [company_id]
  );
  return rows;
}

async function getPendingDrivers(company_id) {
  const { rows } = await pool.query(
    `SELECT id_driver, full_name, first_surname, second_surname, company_email, employee_number, created_at
     FROM driver WHERE company_id = $1 AND is_account_activated = FALSE
     ORDER BY created_at DESC`,
    [company_id]
  );
  return rows;
}

async function getDriverById(id_driver, company_id) {
  const { rows } = await pool.query(
    `SELECT id_driver, company_id, full_name, first_surname, second_surname,
            personal_email, company_email, dni, phone_number,
            employee_number, is_active, is_account_activated, created_at
     FROM driver
     WHERE id_driver = $1 AND company_id = $2`,
    [id_driver, company_id]
  );

  console.log('REPO rows:', rows);

  return rows[0] || null;
}

async function updateDriverByCompany(id_driver, company_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE driver SET ${setClause}
     WHERE id_driver = $${keys.length + 1} AND company_id = $${keys.length + 2}
     RETURNING id_driver, full_name, first_surname, second_surname, company_email, dni, phone_number, employee_number, is_active`,
    [...values, id_driver, company_id]
  );
  return rows[0] || null;
}

async function existsDriverByEmail(companyEmail) {
  const { rows } = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM driver WHERE company_email = $1) AS exists`,
    [companyEmail]
  );
  return rows[0].exists;
}

async function addDriver(company_id, full_name, first_surname, second_surname, personal_email, 
                          company_email, dni, phone_number, activation_token) {
  const employee_number = await generateDriverCode(pool);
  const { rows } = await pool.query(
    `INSERT INTO driver (company_id, full_name, first_surname, second_surname, personal_email, company_email, 
                          dni, phone_number, employee_number, activation_token, is_account_activated, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, FALSE, TRUE)
     RETURNING id_driver, full_name, first_surname, second_surname, personal_email, company_email, dni, phone_number, employee_number, created_at`,
    [company_id, full_name, first_surname, second_surname, personal_email, company_email, dni, phone_number, employee_number, activation_token]
  );
  return rows[0];
}

async function getDriverByToken(token) {
  const { rows } = await pool.query(
    `SELECT id_driver, company_email, is_account_activated 
     FROM driver WHERE activation_token = $1`,
    [token]
  );
  return rows[0] || null;
}

async function activateDriver(id_driver, password_hash) {
  const { rows } = await pool.query(
    `UPDATE driver 
     SET password_hash = $1, is_account_activated = TRUE, activation_token = NULL
     WHERE id_driver = $2
     RETURNING id_driver, full_name, company_email`,
    [password_hash, id_driver]
  );
  return rows[0];
}

async function deleteDriver(id_driver, company_id) {
  const { rows } = await pool.query(
    `DELETE FROM driver WHERE id_driver = $1 AND company_id = $2
     RETURNING id_driver`,
    [id_driver, company_id]
  );
  return rows[0] || null;
}

async function getCompanyById(company_id) {
  const { rows } = await pool.query(
    `SELECT id_company, name_company
     FROM company
     WHERE id_company = $1
     LIMIT 1`,
    [company_id]
  );

  return rows[0] || null;
}

module.exports = { 
  getDriverByCompany, 
  getPendingDrivers, 
  getDriverById, 
  updateDriverByCompany, 
  existsDriverByEmail, 
  addDriver, 
  getDriverByToken, 
  activateDriver, 
  deleteDriver,
  getCompanyById
};