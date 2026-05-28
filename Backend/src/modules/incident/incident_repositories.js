const { pool } = require('../../config/db');

async function getIncidentByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT i.id_incident, i.driver_id, i.bus_id, i.service_id,
            i.incident_type, i.descriptions, i.status, i.resolved_at, i.created_at,
            d.full_name AS driver_full_name, d.first_surname AS driver_first_surname,
            d.second_surname AS driver_second_surname,
            b.license_plate AS bus_license_plate
     FROM incident i
     JOIN driver d ON d.id_driver = i.driver_id
     JOIN bus b ON b.id_bus = i.bus_id  
     WHERE d.company_id = $1
     ORDER BY i.created_at DESC`,
    [company_id]
  );
  return rows;
}

async function getIncidentById(id_incident, company_id) {
  const { rows } = await pool.query(
    `SELECT i.id_incident, i.driver_id, i.bus_id, i.service_id,
            i.incident_type, i.descriptions, i.status, i.resolved_at, i.created_at,
            d.full_name AS driver_full_name, d.first_surname AS driver_first_surname,
            d.second_surname AS driver_second_surname,
            b.license_plate AS bus_license_plate
     FROM incident i
     JOIN driver d ON d.id_driver = i.driver_id
     JOIN bus b ON b.id_bus = i.bus_id
     WHERE i.id_incident = $1 AND d.company_id = $2`,
    [id_incident, company_id]
  );
  return rows[0] || null;
}

async function addIncident(driver_id, bus_id, service_id, incident_type, descriptions) {
  const { rows } = await pool.query(
    `INSERT INTO incident (driver_id, bus_id, service_id, incident_type, descriptions, status)
     VALUES ($1, $2, $3, $4, $5, 'open')
     RETURNING id_incident, driver_id, bus_id, service_id, incident_type, descriptions, status, created_at`,
    [driver_id, bus_id, service_id, incident_type, descriptions]
  );
  return rows[0];
}

async function updateIncident(id_incident, company_id, fields) {
  if (fields.status === 'resolved') {
    fields.resolved_at = new Date().toISOString();
  }

  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE incident i SET ${setClause}
     FROM driver d
     WHERE i.id_incident = $${keys.length + 1}
     AND i.driver_id = d.id_driver
     AND d.company_id = $${keys.length + 2}
     RETURNING i.id_incident, i.incident_type, i.descriptions, i.status, i.resolved_at`,
    [...values, id_incident, company_id]
  );
  return rows[0] || null;
}

async function deleteIncident(id_incident, company_id) {
  const { rows } = await pool.query(
    `DELETE FROM incident i
     USING driver d
     WHERE i.id_incident = $1
     AND i.driver_id = d.id_driver
     AND d.company_id = $2
     RETURNING i.id_incident`,
    [id_incident, company_id]
  );
  return rows[0] || null;
}

async function getServiceByIdAndDriver(service_id, driver_id) {
  const { rows } = await pool.query(
    `SELECT s.id_service, s.status, s.line_id,
            r.id_route
     FROM services s
     LEFT JOIN service_routes sr ON sr.service_id = s.id_service
     LEFT JOIN routes r ON r.id_route = sr.route_id
     WHERE s.id_service = $1 AND s.driver_id = $2`,
    [service_id, driver_id]
  );
  return rows[0] || null;
}

module.exports = { 
  getIncidentByCompany, 
  getIncidentById, 
  addIncident, 
  updateIncident, 
  deleteIncident,
  getServiceByIdAndDriver
};