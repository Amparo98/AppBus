const { pool } = require('../../config/db');

async function getRouteByLine(line_id) {
  const { rows } = await pool.query(
    `SELECT id_route, line_id, origin, destination, estimated_duration, direction, is_active, created_at
     FROM routes WHERE line_id = $1 ORDER BY created_at DESC`,
    [line_id]
  );
  return rows;
}

async function getRouteById(id_route, line_id) {
  const { rows } = await pool.query(
    `SELECT id_route, line_id, origin, destination, estimated_duration, direction, is_active, created_at
     FROM routes WHERE id_route = $1 AND line_id = $2`,
    [id_route, line_id]
  );
  return rows[0] || null;
}

async function createRoute(line_id, origin, destination, estimated_duration, is_active, direction) {
  const { rows } = await pool.query(
    `INSERT INTO routes (line_id, origin, destination, estimated_duration, is_active, direction)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_route, line_id, origin, destination, estimated_duration, is_active, direction, created_at`,
    [line_id, origin, destination, estimated_duration, is_active, direction]
  );
  return rows[0];
}

async function updateRoute(id_route, line_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE routes SET ${setClause}
     WHERE id_route = $${keys.length + 1} AND line_id = $${keys.length + 2}
     RETURNING id_route, line_id, origin, destination, estimated_duration, direction, is_active, created_at`,
    [...values, id_route, line_id]
  );
  return rows[0] || null;
}

async function deleteRoute(id_route, line_id) {
  const { rows } = await pool.query(
    `DELETE FROM routes WHERE id_route = $1 AND line_id = $2
     RETURNING id_route`,
    [id_route, line_id]
  );
  return rows[0] || null;
}

module.exports = { getRouteByLine, getRouteById, createRoute, updateRoute, deleteRoute };