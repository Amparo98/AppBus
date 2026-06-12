const { pool } = require('../../../config/db');

async function getAllStops() {
  const { rows } = await pool.query(
    `SELECT id_stop, name_stop, address_stop,
            ST_Y(locations::geometry) AS latitude,
            ST_X(locations::geometry) AS longitude,
            created_at
     FROM stops
     ORDER BY created_at DESC`
  );
  return rows;
}

async function getStopById(id_stop) {
  const { rows } = await pool.query(
    `SELECT id_stop, name_stop, address_stop,
            ST_Y(locations::geometry) AS latitude,
            ST_X(locations::geometry) AS longitude,
            created_at
     FROM stops WHERE id_stop = $1`,
    [id_stop]
  );
  return rows[0] || null;
}

async function createStop(name_stop, address_stop, latitude, longitude) {
  const { rows } = await pool.query(
    `INSERT INTO stops (name_stop, address_stop, locations)
     VALUES ($1, $2, ST_SetSRID(ST_MakePoint($4, $3), 4326))
     RETURNING id_stop, name_stop, address_stop,
               ST_Y(locations::geometry) AS latitude,
               ST_X(locations::geometry) AS longitude,
               created_at`,
    [name_stop, address_stop, latitude, longitude]
  );
  return rows[0];
}

async function updateStop(id_stop, fields) {
  const { latitude, longitude, ...rest } = fields;
  let query;
  let values;

  if (latitude !== undefined && longitude !== undefined) {
    const keys = Object.keys(rest);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const locationParam = keys.length + 1;

    query = `
      UPDATE stops SET ${setClause ? setClause + ',' : ''}
      locations = ST_SetSRID(ST_MakePoint($${locationParam + 1}, $${locationParam}), 4326)
      WHERE id_stop = $${locationParam + 2}
      RETURNING id_stop, name_stop, address_stop,
                ST_Y(locations::geometry) AS latitude,
                ST_X(locations::geometry) AS longitude`;
    values = [...Object.values(rest), latitude, longitude, id_stop];
  } else {
    const keys = Object.keys(rest);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    query = `
      UPDATE stops SET ${setClause}
      WHERE id_stop = $${keys.length + 1}
      RETURNING id_stop, name_stop, address_stop,
                ST_Y(locations::geometry) AS latitude,
                ST_X(locations::geometry) AS longitude`;
    values = [...Object.values(rest), id_stop];
  }

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteStop(id_stop) {
  const { rows } = await pool.query(
    `DELETE FROM stops WHERE id_stop = $1 RETURNING id_stop`,
    [id_stop]
  );
  return rows[0] || null;
}

// Route-Stop
async function getStopsByRoute(route_id) {
  const { rows } = await pool.query(
    `SELECT rs.id_route_stop, rs.orders,
            s.id_stop, s.name_stop, s.address_stop,
            ST_Y(s.locations::geometry) AS latitude,
            ST_X(s.locations::geometry) AS longitude
     FROM route_stop rs
     JOIN stops s ON s.id_stop = rs.stop_id
     WHERE rs.route_id = $1
     ORDER BY rs.orders ASC`,
    [route_id]
  );
  return rows;
}

async function addStopToRoute(route_id, stop_id, orders) {
  const { rows } = await pool.query(
    `INSERT INTO route_stop (route_id, stop_id, orders)
     VALUES ($1, $2, $3)
     RETURNING id_route_stop, route_id, stop_id, orders`,
    [route_id, stop_id, orders]
  );
  return rows[0];
}

async function removeStopFromRoute(id_route_stop) {
  const { rows } = await pool.query(
    `DELETE FROM route_stop WHERE id_route_stop = $1
     RETURNING id_route_stop`,
    [id_route_stop]
  );
  return rows[0] || null;
}

// Tiempo estimado de llegada (Haversine)
async function getBusPositionByRoute(route_id, latitude, longitude) {
  const { rows } = await pool.query(
    `SELECT bp.bus_id,
            ST_Y(bp.location_bus::geometry) AS latitude,
            ST_X(bp.location_bus::geometry) AS longitude,
            bp.dates,
            ST_Distance(
              bp.location_bus::geography,
              ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
            ) AS distance_meters
     FROM bus_position bp
     JOIN services s ON s.bus_id = bp.bus_id
     JOIN routes r ON r.line_id = s.line_id
     WHERE s.status = 'in_progress'
     AND r.id_route = $1
     ORDER BY distance_meters ASC
     LIMIT 1`,
    [route_id, longitude, latitude]
  );
  return rows[0] || null;
}

module.exports = {
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop,
  getStopsByRoute,
  addStopToRoute,
  removeStopFromRoute,
  getBusPositionByRoute
};