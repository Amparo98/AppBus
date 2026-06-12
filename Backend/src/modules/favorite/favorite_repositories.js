const { pool } = require('../../config/db');

async function getFavoritesByClient(client_id) {
  const { rows } = await pool.query(
    `SELECT f.id_favorite, f.created_at,
            s.id_stop, s.name_stop, s.address_stop,
            ST_Y(s.locations::geometry) AS latitude,
            ST_X(s.locations::geometry) AS longitude,
            r.id_route, r.origin, r.destination, r.direction,
            l.code AS line_code, l.name_line, l.color
     FROM favorite f
     JOIN stops s ON s.id_stop = f.stop_id
     JOIN routes r ON r.id_route = f.route_id
     JOIN line l ON l.id_line = r.line_id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [client_id]
  );
  return rows;
}

async function addFavorite(client_id, stop_id, route_id) {
  const { rows } = await pool.query(
    `INSERT INTO favorite (user_id, stop_id, route_id)
     VALUES ($1, $2, $3)
     RETURNING id_favorite, user_id, stop_id, route_id, created_at`,
    [client_id, stop_id, route_id]
  );
  return rows[0];
}

async function deleteFavorite(id_favorite, client_id) {
  const { rows } = await pool.query(
    `DELETE FROM favorite
     WHERE id_favorite = $1 AND user_id = $2
     RETURNING id_favorite`,
    [id_favorite, client_id]
  );
  return rows[0] || null;
}

async function existsFavorite(client_id, stop_id, route_id) {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT 1 FROM favorite
      WHERE user_id = $1 AND stop_id = $2 AND route_id = $3
    ) AS exists`,
    [client_id, stop_id, route_id]
  );
  return rows[0].exists;
}

module.exports = { 
  getFavoritesByClient, 
  addFavorite, 
  deleteFavorite,
  existsFavorite
};