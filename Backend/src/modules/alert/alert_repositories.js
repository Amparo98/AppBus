const { pool } = require('../../config/db');

async function getAlertByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT a.id_alert, a.route_id, a.alert_type, a.title, 
            a.descriptions, a.starts_date, a.end_date, a.is_active, a.created_at,
            r.origin, r.destination
     FROM service_alert a
     JOIN routes r ON r.id_route = a.route_id
     JOIN line l ON l.id_line = r.line_id
     WHERE l.company_id = $1
     ORDER BY a.created_at DESC`,
    [company_id]
  );
  return rows;
}

async function getAlertById(id_alert, company_id) {
  const { rows } = await pool.query(
    `SELECT a.id_alert, a.route_id, a.alert_type, a.title,
            a.descriptions, a.starts_date, a.end_date, a.is_active, a.created_at,
            r.origin, r.destination
     FROM service_alert a
     JOIN routes r ON r.id_route = a.route_id
     JOIN line l ON l.id_line = r.line_id
     WHERE a.id_alert = $1 AND l.company_id = $2`,
    [id_alert, company_id]
  );
  return rows[0] || null;
}

async function addAlert(route_id, alert_type, title, descriptions, starts_date, end_date) {
  const { rows } = await pool.query(
    `INSERT INTO service_alert (route_id, alert_type, title, descriptions, starts_date, end_date, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id_alert, route_id, alert_type, title, descriptions, starts_date, end_date, is_active, created_at`,
    [route_id, alert_type, title, descriptions, starts_date, end_date]
  );
  return rows[0];
}

async function updateAlert(id_alert, company_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE service_alert a SET ${setClause}
     FROM routes r, line l
     WHERE a.id_alert = $${keys.length + 1}
     AND a.route_id = r.id_route
     AND r.line_id = l.id_line
     AND l.company_id = $${keys.length + 2}
     RETURNING a.id_alert, a.alert_type, a.title, a.descriptions, a.is_active`,
    [...values, id_alert, company_id]
  );
  return rows[0] || null;
}

async function deleteAlert(id_alert, company_id) {
  const { rows } = await pool.query(
    `DELETE FROM service_alert a
     USING routes r, line l
     WHERE a.id_alert = $1
     AND a.route_id = r.id_route
     AND r.line_id = l.id_line
     AND l.company_id = $2
     RETURNING a.id_alert`,
    [id_alert, company_id]
  );
  return rows[0] || null;
}

module.exports = { 
  getAlertByCompany,
  getAlertById,
  addAlert,
  updateAlert,
  deleteAlert
};