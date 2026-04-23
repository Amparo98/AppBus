const { pool } = require('../config/db');

async function getIncidenciasByEmpresa(empresa_id) {
  const { rows } = await pool.query(
    `SELECT i.id_incidencia, i.conductor_id, i.bus_id, i.trayecto_id,
            i.tipo_incidencia, i.descripcion, i.estado, i.resuelta_at, i.created_at,
            c.nombre AS conductor_nombre, c.apellido AS conductor_apellido,
            b.matricula AS bus_matricula
     FROM incidencia i
     JOIN conductor c ON c.id_conductor = i.conductor_id
     JOIN bus b ON b.id_bus = i.bus_id
     WHERE c.empresa_id = $1
     ORDER BY i.created_at DESC`,
    [empresa_id]
  );
  return rows;
}

async function getIncidenciaById(id_incidencia, empresa_id) {
  const { rows } = await pool.query(
    `SELECT i.id_incidencia, i.conductor_id, i.bus_id, i.trayecto_id,
            i.tipo_incidencia, i.descripcion, i.estado, i.resuelta_at, i.created_at,
            c.nombre AS conductor_nombre, c.apellido AS conductor_apellido,
            b.matricula AS bus_matricula
     FROM incidencia i
     JOIN conductor c ON c.id_conductor = i.conductor_id
     JOIN bus b ON b.id_bus = i.bus_id
     WHERE i.id_incidencia = $1 AND c.empresa_id = $2`,
    [id_incidencia, empresa_id]
  );
  return rows[0] || null;
}

async function createIncidencia(conductor_id, bus_id, trayecto_id, tipo_incidencia, descripcion) {
  const { rows } = await pool.query(
    `INSERT INTO incidencia (conductor_id, bus_id, trayecto_id, tipo_incidencia, descripcion, estado)
     VALUES ($1, $2, $3, $4, $5, 'abierta')
     RETURNING id_incidencia, conductor_id, bus_id, trayecto_id, tipo_incidencia, descripcion, estado, created_at`,
    [conductor_id, bus_id, trayecto_id, tipo_incidencia, descripcion]
  );
  return rows[0];
}

async function updateIncidencia(id_incidencia, empresa_id, fields) {
  // Si se cierra la incidencia, registrar resuelta_at
  if (fields.estado === 'cerrada') {
    fields.resuelta_at = new Date().toISOString();
  }

  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE incidencia i SET ${setClause}
     FROM conductor c
     WHERE i.id_incidencia = $${keys.length + 1}
     AND i.conductor_id = c.id_conductor
     AND c.empresa_id = $${keys.length + 2}
     RETURNING i.id_incidencia, i.tipo_incidencia, i.descripcion, i.estado, i.resuelta_at`,
    [...values, id_incidencia, empresa_id]
  );
  return rows[0] || null;
}

module.exports = { getIncidenciasByEmpresa, getIncidenciaById, createIncidencia, updateIncidencia };