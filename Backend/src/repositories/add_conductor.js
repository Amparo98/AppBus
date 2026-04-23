const { pool } = require('../config/db');
const { generarCodigoConductor } = require('../utils/generarCodigo.js');

async function getConductoresByEmpresaId(empresa_id) {
  const { rows } = await pool.query(
    `SELECT id_conductor, nombre, apellido, email, dni, telefono, num_trabajador, cuenta_activada, activo, created_at
     FROM conductor WHERE empresa_id = $1 ORDER BY created_at DESC`,
    [empresa_id]
  );
  return rows;
}

async function getConductoresPendientes(empresa_id) {
  const { rows } = await pool.query(
    `SELECT id_conductor, nombre, apellido, email, num_trabajador, created_at
     FROM conductor WHERE empresa_id = $1 AND cuenta_activada = FALSE
     ORDER BY created_at DESC`,
    [empresa_id]
  );
  return rows;
}

async function getConductorById(id_conductor, empresa_id) {
  const { rows } = await pool.query(
    `SELECT id_conductor, nombre, apellido, email, dni, telefono,
            num_trabajador, activo, cuenta_activada, created_at
     FROM conductor WHERE id_conductor = $1 AND empresa_id = $2`,
    [id_conductor, empresa_id]
  );
  return rows[0] || null;
}

async function updateConductorEmpresa(id_conductor, empresa_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE conductor SET ${setClause}
     WHERE id_conductor = $${keys.length + 1} AND empresa_id = $${keys.length + 2}
     RETURNING id_conductor, nombre, apellido, email, dni, telefono, num_trabajador, activo`,
    [...values, id_conductor, empresa_id]
  );
  return rows[0] || null;
}

async function existsConductorByEmail(email) {
  const { rows } = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM conductor WHERE email = $1) AS exists`,
    [email]
  );
  return rows[0].exists;
}

async function agregarConductor(empresa_id, nombre, apellido, email, dni, telefono, token_activacion) {
  const num_trabajador = await generarCodigoConductor(pool);
  const { rows } = await pool.query(
    `INSERT INTO conductor (empresa_id, nombre, apellido, email, dni, telefono, num_trabajador, token_activacion, cuenta_activada, activo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, TRUE)
     RETURNING id_conductor, nombre, apellido, email, dni, telefono, num_trabajador, created_at`,
    [empresa_id, nombre, apellido, email, dni, telefono, num_trabajador, token_activacion]
  );
  return rows[0];
}

async function getConductorByToken(token) {
  const { rows } = await pool.query(
    `SELECT id_conductor, email, cuenta_activada 
     FROM conductor WHERE token_activacion = $1`,
    [token]
  );
  return rows[0] || null;
}

async function activarConductor(id_conductor, password_hash) {
  const { rows } = await pool.query(
    `UPDATE conductor 
     SET password_hash = $1, cuenta_activada = TRUE, token_activacion = NULL
     WHERE id_conductor = $2
     RETURNING id_conductor, nombre, email`,
    [password_hash, id_conductor]
  );
  return rows[0];
}

async function deleteConductor(id_conductor, empresa_id) {
  const { rows } = await pool.query(
    `DELETE FROM conductor WHERE id_conductor = $1 AND empresa_id = $2
     RETURNING id_conductor`,
    [id_conductor, empresa_id]
  );
  return rows[0] || null;
}

module.exports = { getConductoresByEmpresaId, getConductoresPendientes, getConductorById, updateConductorEmpresa, existsConductorByEmail, agregarConductor, getConductorByToken, activarConductor, deleteConductor };