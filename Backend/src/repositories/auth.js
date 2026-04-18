const { pool } = require('../config/db');

async function getUsuarioByEmail(email) {
  const query = `
    SELECT id_usuario, nombre, email, password_hash
    FROM usuario
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function getEmpresaByEmail(email) {
  const query = `
    SELECT id_empresa, nombre, email, password_hash
    FROM empresa
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

// para registro 
async function createUsuario(nombre, email, passwordHash) {
    const query = `
        INSERT INTO usuario (nombre, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id_usuario, nombre, email
    `;
    const values = [nombre, email, passwordHash];
    const { rows } = await pool.query(query, values);    
    return rows[0];
}

async function createEmpresa(nombre, email, passwordHash) {
    const query = `
        INSERT INTO empresa (nombre, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id_empresa, nombre, email
    `;
    const values = [nombre, email, passwordHash];
    const { rows } = await pool.query(query, values);    
    return rows[0];
}


async function existsUsuarioByEmail(email) {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM usuario WHERE email = $1
        ) AS exists
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0].exists;
}

async function existsEmpresaByEmail(email) {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM empresa WHERE email = $1
        ) AS exists
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0].exists;
}

module.exports = {
  getUsuarioByEmail,
  getEmpresaByEmail,
  createUsuario,
  createEmpresa,
  existsUsuarioByEmail,
  existsEmpresaByEmail
};