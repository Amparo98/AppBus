const { pool } = require('../../config/db');

async function getIncidenceByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT i.id_incidence, i.driver_id, i.bus_id, i.route_id,
            i.incidence_type, i.descriptions, i.states, i.resolved_at, i.created_at,
            d.full_name AS driver_full_name, d.first_surname AS driver_first_surname, d.second_surname AS driver_second_surname,
            b.license_plate AS bus_license_plate
     FROM incidence i
     JOIN driver d ON d.id_driver = i.driver_id
     JOIN bus b ON b.id_bus = i.bus_id  
     WHERE d.company_id = $1
     ORDER BY i.created_at DESC`,
    [company_id]
  );
  return rows;
}

async function getIncidenceById(id_incidence, company_id) {
  const { rows } = await pool.query(
    `SELECT i.id_incidence, i.driver_id, i.bus_id, i.route_id,
            i.incidence_type, i.descriptions, i.states, i.resolved_at, i.created_at,
            d.full_name AS driver_full_name, d.first_surname AS driver_first_surname, d.second_surname AS driver_second_surname,
            b.license_plate AS bus_license_plate
     FROM incidence i
     JOIN driver d ON d.id_driver = i.driver_id
     JOIN bus b ON b.id_bus = i.bus_id
     WHERE i.id_incidence = $1 AND d.company_id = $2`,
    [id_incidence, company_id]
  );
  return rows[0] || null;
}

async function addIncidence(driver_id, bus_id, route_id, incidence_type, descriptions) {
  const { rows } = await pool.query(
    `INSERT INTO incidence (driver_id, bus_id, route_id, incidence_type, descriptions, states)
     VALUES ($1, $2, $3, $4, $5, 'open')
     RETURNING id_incidence, driver_id, bus_id, route_id, incidence_type, descriptions, states, created_at`,
    [driver_id, bus_id, route_id, incidence_type, descriptions]
  );
  return rows[0];
}

async function updateIncidence(id_incidence, company_id, fields) {
  // Si se cierra la incidencia, registrar resolved_at
  if (fields.states === 'closed') {
    fields.resolved_at = new Date().toISOString();
  }

  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE incidence i SET ${setClause}
     FROM driver d
     WHERE i.id_incidence = $${keys.length + 1}
     AND i.driver_id = d.id_driver
     AND d.company_id = $${keys.length + 2}
     RETURNING i.id_incidence, i.incidence_type, i.descriptions, i.states, i.resolved_at`,
    [...values, id_incidence, company_id]
  );
  return rows[0] || null;
}

async function deleteIncidence(id_incidence, company_id) {
  const { rows } = await pool.query(
    `DELETE FROM incidence i
     USING driver d
     WHERE i.id_incidence = $1
     AND i.driver_id = d.id_driver
     AND d.company_id = $2
     RETURNING i.id_incidence`,
    [id_incidence, company_id]
  );

  return rows[0] || null;
}

module.exports = { getIncidenceByCompany, getIncidenceById, addIncidence, updateIncidence, deleteIncidence };