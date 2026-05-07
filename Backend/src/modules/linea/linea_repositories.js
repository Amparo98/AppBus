const { pool } = require('../../config/db.js');
const { generarCodigoLinea } = require('../../utils/generarCodigo.js');

async function getLineaByEmpresa(empresa_id) {
  const { rows } = await pool.query(
    `SELECT id_linea, nombre, color, codigo, created_at
     FROM linea WHERE empresa_id = $1 ORDER BY created_at DESC`,
    [empresa_id]
  );
  return rows;
}

async function getLineaById(codigo, empresa_id) {
  const { rows } = await pool.query(
    `SELECT id_linea, nombre, color, codigo, created_at
     FROM linea WHERE codigo = $1 AND empresa_id = $2`,
    [codigo, empresa_id]
  );
  return rows[0] || null;
}

async function createLinea(empresa_id, nombre, color) {
  const codigo = await generarCodigoLinea(pool);
    const { rows } = await pool.query(
    `INSERT INTO linea (empresa_id, nombre, color, codigo)
     VALUES ($1, $2, $3, $4)
     RETURNING id_linea, nombre, color, codigo, created_at`,
    [empresa_id, nombre, color, codigo]
  );
  return rows[0];
}

async function updateLinea(codigo, empresa_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE linea SET ${setClause}
     WHERE codigo = $${keys.length + 1} AND empresa_id = $${keys.length + 2}
     RETURNING id_linea, nombre, color, codigo, created_at`,
    [...values, codigo, empresa_id]
  );
  return rows[0] || null;
}

async function deleteLinea(codigo, empresa_id) {
    const { rows } = await pool.query(
    `DELETE FROM linea WHERE codigo = $1 AND empresa_id = $2
     RETURNING id_linea`,
    [codigo, empresa_id]
  );
  return rows[0] || null;
}

module.exports = {
  getLineaByEmpresa,
  getLineaById,
  createLinea,
  updateLinea,
  deleteLinea
};