const incidentRepository = require('./incident_repositories.js');
const { validateTransition } = require('../../utils/state_transition.js');
const appError = require('../../utils/appError.js');

async function getAllIncident(company_id) {
  return await incidentRepository.getIncidentByCompany(company_id);
}

async function getIncident(id_incident, company_id) {
  const incident = await incidentRepository.getIncidentById(id_incident, company_id);
  if (!incident) throw appError('INCIDENT_NOT_FOUND', 404);
  return incident;
}

async function addIncident(driver_id, data) {
  const { bus_id, service_id, incident_type, descriptions } = data;

  // Verificar que el servicio está en curso
  const { pool } = require('../../config/db');
  const { rows } = await pool.query(
    `SELECT id_service, status FROM services WHERE id_service = $1 AND driver_id = $2`,
    [service_id, driver_id]
  );

  if (rows.length === 0) throw appError('SERVICE_NOT_FOUND', 404);
  if (rows[0].status !== 'in_progress') throw appError('SERVICE_NOT_ACTIVE', 400);

  return await incidentRepository.addIncident(driver_id, bus_id, service_id, incident_type, descriptions);
}

async function updateIncident(id_incident, company_id, data) {
  if (data.status) {
    const incidentCurrent = await incidentRepository.getIncidentById(id_incident, company_id);
    if (!incidentCurrent) throw appError('INCIDENT_NOT_FOUND', 404);
    validateTransition('incident', incidentCurrent.status, data.status);
  }

  const incident = await incidentRepository.updateIncident(id_incident, company_id, data);
  if (!incident) throw appError('INCIDENT_NOT_FOUND', 404);
  return incident;
}

async function deleteIncident(id_incident, company_id) {
  const incident = await incidentRepository.deleteIncident(id_incident, company_id);
  if (!incident) throw appError('INCIDENT_NOT_FOUND', 404);
}

module.exports = { getAllIncident, getIncident, addIncident, updateIncident, deleteIncident };