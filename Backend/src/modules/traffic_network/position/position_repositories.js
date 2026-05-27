const { pool } = require('../../../config/db');

async function savePosition(bus_id, latitude, longitude) {
  const { rows } = await pool.query(
    `INSERT INTO bus_position (bus_id, location_bus)
     VALUES ($1, ST_SetSRID(ST_MakePoint($3, $2), 4326))
     RETURNING id_position, bus_id,
               ST_Y(location_bus::geometry) AS latitude,
               ST_X(location_bus::geometry) AS longitude,
               dates`,
    [bus_id, latitude, longitude]
  );
  return rows[0];
}

async function getLastPosition(bus_id) {
  const { rows } = await pool.query(
    `SELECT id_position, bus_id,
            ST_Y(location_bus::geometry) AS latitude,
            ST_X(location_bus::geometry) AS longitude,
            dates
     FROM bus_position
     WHERE bus_id = $1
     ORDER BY dates DESC
     LIMIT 1`,
    [bus_id]
  );
  return rows[0] || null;
}

async function getLastPositionsByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (bp.bus_id)
            bp.id_position, bp.bus_id,
            ST_Y(bp.location_bus::geometry) AS latitude,
            ST_X(bp.location_bus::geometry) AS longitude,
            bp.dates,
            b.license_plate
     FROM bus_position bp
     JOIN bus b ON b.id_bus = bp.bus_id
     WHERE b.company_id = $1
     ORDER BY bp.bus_id, bp.dates DESC`,
    [company_id]
  );
  return rows;
}

module.exports = { 
    savePosition, 
    getLastPosition, 
    getLastPositionsByCompany 
};