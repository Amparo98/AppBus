const { pool } = require('../config/db');

async function getAvisosByEmpresa(empresa_id) {
  const { rows } = await pool.query(
    `SELECT a.id_aviso, a.trayecto_id, a.tipo_aviso, a.titulo, 
            a.descripcion, a.fecha_inicio, a.fecha_fin, a.activo, a.created_at,
            t.origen, t.destino
     FROM aviso_servicio a
     JOIN trayecto t ON t.id_trayecto = a.trayecto_id
     JOIN linea l ON l.id_linea = t.linea_id
     WHERE l.empresa_id = $1
     ORDER BY a.created_at DESC`,
    [empresa_id]
  );
  return rows;
}

async function getAvisoById(id_aviso, empresa_id) {
  const { rows } = await pool.query(
    `SELECT a.id_aviso, a.trayecto_id, a.tipo_aviso, a.titulo,
            a.descripcion, a.fecha_inicio, a.fecha_fin, a.activo, a.created_at,
            t.origen, t.destino
     FROM aviso_servicio a
     JOIN trayecto t ON t.id_trayecto = a.trayecto_id
     JOIN linea l ON l.id_linea = t.linea_id
     WHERE a.id_aviso = $1 AND l.empresa_id = $2`,
    [id_aviso, empresa_id]
  );
  return rows[0] || null;
}

async function createAviso(trayecto_id, tipo_aviso, titulo, descripcion, fecha_inicio, fecha_fin) {
  const { rows } = await pool.query(
    `INSERT INTO aviso_servicio (trayecto_id, tipo_aviso, titulo, descripcion, fecha_inicio, fecha_fin, activo)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id_aviso, trayecto_id, tipo_aviso, titulo, descripcion, fecha_inicio, fecha_fin, activo, created_at`,
    [trayecto_id, tipo_aviso, titulo, descripcion, fecha_inicio, fecha_fin]
  );
  return rows[0];
}

async function updateAviso(id_aviso, empresa_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE aviso_servicio a SET ${setClause}
     FROM trayecto t
     JOIN linea l ON l.id_linea = t.linea_id
     WHERE a.id_aviso = $${keys.length + 1}
     AND a.trayecto_id = t.id_trayecto
     AND l.empresa_id = $${keys.length + 2}
     RETURNING a.id_aviso, a.tipo_aviso, a.titulo, a.descripcion, a.activo`,
    [...values, id_aviso, empresa_id]
  );
  return rows[0] || null;
}

async function deleteAviso(id_aviso, empresa_id) {
  const { rows } = await pool.query(
    `DELETE FROM aviso_servicio a
     USING trayecto t
     JOIN linea l ON l.id_linea = t.linea_id
     WHERE a.id_aviso = $1
     AND a.trayecto_id = t.id_trayecto
     AND l.empresa_id = $2
     RETURNING a.id_aviso`,
    [id_aviso, empresa_id]
  );
  return rows[0] || null;
}

module.exports = { getAvisosByEmpresa, getAvisoById, createAviso, updateAviso, deleteAviso };