const { pool } = require('../../config/db');

async function getServiceByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT s.id_service, s.driver_id, s.bus_id, s.line_id, s.shift,
            s.service_date, s.status,s.started_at, s.finished_at, s.created_at,
            d.full_name AS driver_name, d.first_surname AS driver_surname,
            d.employee_number,
            b.license_plate AS bus_license
     FROM services s
     JOIN driver d ON d.id_driver = s.driver_id
     JOIN bus b ON b.id_bus = s.bus_id
     WHERE d.company_id = $1
     ORDER BY s.service_date DESC`,
    [company_id]
  );
  return rows;
}

async function getServiceById(id_service, company_id) {
  const { rows } = await pool.query(
    `SELECT s.id_service, s.driver_id, s.bus_id, s.line_id,
            s.shift, s.service_date, s.status,s.started_at, s.finished_at, s.created_at,
            d.full_name AS driver_name, d.first_surname AS driver_surname,
            d.employee_number,
            b.license_plate AS bus_license
     FROM services s
     JOIN driver d ON d.id_driver = s.driver_id
     JOIN bus b ON b.id_bus = s.bus_id
     WHERE s.id_service = $1 AND d.company_id = $2`,
    [id_service, company_id]
  );
  return rows[0] || null;
}

async function getServiceByDriver(driver_id) {
  const { rows } = await pool.query(
    `SELECT s.id_service, s.driver_id, s.bus_id, s.line_id, s.shift,
            s.service_date, s.status,s.started_at, s.finished_at, s.created_at,
            d.full_name AS driver_name, d.first_surname AS driver_surname,
            d.employee_number,
            b.license_plate AS bus_license
     FROM services s
     JOIN driver d ON d.id_driver = s.driver_id
     JOIN bus b ON b.id_bus = s.bus_id
     WHERE s.driver_id = $1
     ORDER BY s.service_date DESC`,
    [driver_id]
  );
  return rows;
}

async function addService(driver_id, bus_id, line_id, shift, service_date){
  const { rows } = await pool.query(
    `INSERT INTO services (driver_id, bus_id, line_id, shift, service_date, status)
     VALUES ($1, $2, $3, $4, $5, 'Programado')
     RETURNING id_service, driver_id, bus_id, line_id, shift, service_date, status, created_at`,
    [driver_id, bus_id, line_id, shift, service_date]
  );
  return rows[0];
}

async function updateService(id_service, company_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE services SET ${setClause}
     FROM driver d
     WHERE services.id_service = $${keys.length + 1}
     AND services.driver_id = d.id_driver
     AND d.company_id = $${keys.length + 2}
     RETURNING services.id_service, services.driver_id, services.bus_id,
               services.line_id, services.shift, services.service_date, 
               services.status`,
    [...values, id_service, company_id]
  );
  return rows[0] || null;
}

async function deleteService(id_service, company_id) {
  const { rows } = await pool.query(
    `DELETE FROM services s
     USING driver d
     WHERE s.id_service = $1
     AND s.driver_id = d.id_driver
     AND d.company_id = $2
     RETURNING s.id_service`,
    [id_service, company_id]
  );
  return rows[0] || null;
}

async function startService(id_service, driver_id) {
  const { rows } = await pool.query(
    `UPDATE services 
     SET status = 'in_progress', started_at = NOW()
     WHERE id_service = $1 AND driver_id = $2
     RETURNING id_service, driver_id, bus_id, line_id,
               shift, service_date, status, started_at, created_at`,
    [id_service, driver_id]
  );
  return rows[0] || null;
}

async function finishService(id_service, driver_id) {
  const { rows } = await pool.query(
    `UPDATE services 
     SET status = 'completed', finished_at  = NOW()
     WHERE id_service = $1 AND driver_id = $2
     RETURNING id_service, driver_id, bus_id, line_id,
               shift, service_date, status, finished_at , created_at`,
    [id_service, driver_id]
  );
  return rows[0] || null;
}

async function membershipByCompany(driver_id, bus_id, line_id, company_id) {
  const { rows } = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM driver WHERE id_driver = $1 AND company_id = $4) AS driver_ok,
      (SELECT COUNT(*) FROM bus WHERE id_bus = $2 AND company_id = $4) AS bus_ok,
      (SELECT COUNT(*) FROM line WHERE id_line = $3 AND company_id = $4) AS line_ok`,
    [driver_id, bus_id, line_id, company_id]
  );
  return rows[0];
}

async function existsService(driver_id, shift, service_date) {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT 1 FROM services 
      WHERE driver_id = $1 AND shift = $2 AND service_date = $3
    ) AS exists`,
    [driver_id, shift, service_date]
  );
  return rows[0].exists;
} 

module.exports = { 
  getServiceByCompany,
  getServiceById,
  getServiceByDriver,
  addService,
  updateService,
  deleteService,
  startService,
  finishService,
  membershipByCompany,
  existsService
};