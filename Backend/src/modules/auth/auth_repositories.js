const { pool } = require('../../config/db');

async function getClientByEmail(email) {
  const query = `
    SELECT id_usuario, nombre, apellidos, email, password_hash
    FROM usuario
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function getCompanyByEmail(email) {
  const query = `
    SELECT id_empresa, nombre, email, password_hash
    FROM empresa
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function getBusDriverByEmail(email) {
  const query = `
    SELECT id_conductor, nombre, apellido, email, password_hash, 
           num_trabajador, cuenta_activada, activo
    FROM conductor
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

// para registro 
async function createClient(nombre, apellidos, email, passwordHash) {
    const query = `
        INSERT INTO usuario (nombre, apellidos,email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id_usuario, nombre, apellidos, email
    `;
    const values = [nombre, apellidos, email, passwordHash];
    const { rows } = await pool.query(query, values);    
    return rows[0];
}

async function createCompany(nombre, email, passwordHash) {
    const query = `
        INSERT INTO empresa (nombre, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id_empresa, nombre, email
    `;
    const values = [nombre, email, passwordHash];
    const { rows } = await pool.query(query, values);    
    return rows[0];
}


async function existsClient(email) {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM usuario WHERE email = $1
        ) AS exists
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0].exists;
}

async function existsCompanyByEmail(email) {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM empresa WHERE email = $1
        ) AS exists
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0].exists;
}

module.exports = {
  getClientByEmail,
  getCompanyByEmail,
  getBusDriverByEmail,
  createClient,
  createCompany,
  existsClient,
  existsCompanyByEmail
};