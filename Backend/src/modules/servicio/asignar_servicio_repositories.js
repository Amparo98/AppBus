const { pool } = require('../../config/db');

async function getServiciosByEmpresa(empresa_id) {
  const { rows } = await pool.query(
    `SELECT a.id_asignacion, a.conductor_id, a.bus_id, a.trayecto_id, 
            a.fecha_inicio, a.fecha_fin, a.estado, a.created_at,
            c.nombre AS conductor_nombre, c.apellido AS conductor_apellido,
            c.num_trabajador,
            b.matricula AS bus_matricula,
            t.origen, t.destino, t.sentido
     FROM asignar_servicio a
     JOIN conductor c ON c.id_conductor = a.conductor_id
     JOIN bus b ON b.id_bus = a.bus_id
     JOIN trayecto t ON t.id_trayecto = a.trayecto_id
     WHERE c.empresa_id = $1
     ORDER BY a.fecha_inicio DESC`,
    [empresa_id]
  );
  return rows;
}

async function getServicioById(id_asignacion, empresa_id) {
  const { rows } = await pool.query(
    `SELECT a.id_asignacion, a.conductor_id, a.bus_id, a.trayecto_id,
            a.fecha_inicio, a.fecha_fin, a.estado, a.created_at,
            c.nombre AS conductor_nombre, c.apellido AS conductor_apellido,
            c.num_trabajador,
            b.matricula AS bus_matricula,
            t.origen, t.destino, t.sentido
     FROM asignar_servicio a
     JOIN conductor c ON c.id_conductor = a.conductor_id
     JOIN bus b ON b.id_bus = a.bus_id
     JOIN trayecto t ON t.id_trayecto = a.trayecto_id
     WHERE a.id_asignacion = $1 AND c.empresa_id = $2`,
    [id_asignacion, empresa_id]
  );
  return rows[0] || null;
}

async function createServicio(conductor_id, bus_id, trayecto_id, fecha_inicio, fecha_fin) {
  const { rows } = await pool.query(
    `INSERT INTO asignar_servicio (conductor_id, bus_id, trayecto_id, fecha_inicio, fecha_fin, estado)
     VALUES ($1, $2, $3, $4, $5, 'Programado')
     RETURNING id_asignacion, conductor_id, bus_id, trayecto_id, fecha_inicio, fecha_fin, estado, created_at`,
    [conductor_id, bus_id, trayecto_id, fecha_inicio, fecha_fin]
  );
  return rows[0];
}

async function getServiciosByConductor(conductor_id, estado) {
  let query = `
    SELECT a.id_asignacion, a.bus_id, a.trayecto_id,
           a.fecha_inicio, a.fecha_fin, a.estado, a.created_at,
           b.matricula AS bus_matricula,
           t.origen, t.destino, t.sentido,
           l.nombre AS linea_nombre, l.codigo AS linea_codigo, l.color AS linea_color
    FROM asignar_servicio a
    JOIN bus b ON b.id_bus = a.bus_id
    JOIN trayecto t ON t.id_trayecto = a.trayecto_id
    JOIN linea l ON l.id_linea = t.linea_id
    WHERE a.conductor_id = $1
  `;

  const values = [conductor_id];

  if (estado) {
    query += ` AND a.estado = $2`;
    values.push(estado);
  }

  query += ` ORDER BY a.fecha_inicio DESC`;

  const { rows } = await pool.query(query, values);
  return rows;
}

async function updateServicio(id_asignacion, empresa_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE asignar_servicio a SET ${setClause}
     FROM conductor c
     WHERE a.id_asignacion = $${keys.length + 1}
     AND a.conductor_id = c.id_conductor
     AND c.empresa_id = $${keys.length + 2}
     RETURNING a.id_asignacion, a.conductor_id, a.bus_id, a.trayecto_id, 
               a.fecha_inicio, a.fecha_fin, a.estado`,
    [...values, id_asignacion, empresa_id]
  );
  return rows[0] || null;
}

async function deleteServicio(id_asignacion, empresa_id) {
  const { rows } = await pool.query(
    `DELETE FROM asignar_servicio a
     USING conductor c
     WHERE a.id_asignacion = $1
     AND a.conductor_id = c.id_conductor
     AND c.empresa_id = $2
     RETURNING a.id_asignacion`,
    [id_asignacion, empresa_id]
  );
  return rows[0] || null;
}

// Verifica que conductor, bus y trayecto pertenecen a la empresa
async function verificarPertenencia(conductor_id, bus_id, trayecto_id, empresa_id) {
  const { rows } = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM conductor WHERE id_conductor = $1 AND empresa_id = $4) AS conductor_ok,
      (SELECT COUNT(*) FROM bus WHERE id_bus = $2 AND empresa_id = $4) AS bus_ok,
      (SELECT COUNT(*) FROM trayecto t JOIN linea l ON l.id_linea = t.linea_id 
       WHERE t.id_trayecto = $3 AND l.empresa_id = $4) AS trayecto_ok`,
    [conductor_id, bus_id, trayecto_id, empresa_id]
  );
  return rows[0];
}

module.exports = { 
  getServiciosByEmpresa, 
  getServicioById, 
  createServicio, 
  updateServicio, 
  deleteServicio,
  verificarPertenencia,
  getServiciosByConductor
};