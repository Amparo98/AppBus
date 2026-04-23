const { pool } = require('../config/db');

async function getTrayectosByLinea(linea_id) {
  const { rows } = await pool.query(
    `SELECT id_trayecto, linea_id, origen, destino, duracion_estimada, sentido, activo, created_at
     FROM trayecto WHERE linea_id = $1 ORDER BY created_at DESC`,
    [linea_id]
  );
  return rows;
}

async function getTrayectoById(id_trayecto, linea_id) {
  const { rows } = await pool.query(
    `SELECT id_trayecto, linea_id, origen, destino, duracion_estimada, sentido, activo, created_at
     FROM trayecto WHERE id_trayecto = $1 AND linea_id = $2`,
    [id_trayecto, linea_id]
  );
  return rows[0] || null;
}

async function createTrayecto(linea_id, origen, destino, duracion_estimada, activo, sentido) {
  const { rows } = await pool.query(
    `INSERT INTO trayecto (linea_id, origen, destino, duracion_estimada, activo, sentido)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_trayecto, origen, destino, duracion_estimada, activo, sentido, created_at`,
    [linea_id, origen, destino, duracion_estimada, activo, sentido]
  );
  return rows[0];
}

async function updateTrayecto(id_trayecto, linea_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE trayecto SET ${setClause}
     WHERE id_trayecto = $${keys.length + 1} AND linea_id = $${keys.length + 2}
     RETURNING id_trayecto, linea_id, origen, destino, duracion_estimada, sentido, activo, created_at`,
    [...values, id_trayecto, linea_id]
  );
  return rows[0] || null;
}

async function deleteTrayecto(id_trayecto, linea_id) {
  const { rows } = await pool.query(
    `DELETE FROM trayecto WHERE id_trayecto = $1 AND linea_id = $2
     RETURNING id_trayecto`,
    [id_trayecto, linea_id]
  );
  return rows[0] || null;
}

module.exports = {
  getTrayectosByLinea,
  getTrayectoById,
  createTrayecto,
  updateTrayecto,
  deleteTrayecto
};
