const incidentRepository = require('./incident_repositories.js');
const alertRepository = require('../alert/alert_repositories.js');
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

  // Usa el repository en lugar de llamar a la BD directamente
  const service = await incidentRepository.getServiceByIdAndDriver(service_id, driver_id);
  if (!service) throw appError('SERVICE_NOT_FOUND', 404);
  if (service.status !== 'in_progress') throw appError('SERVICE_NOT_ACTIVE', 400);

  const incident = await incidentRepository.addIncident(
    driver_id, bus_id, service_id, incident_type, descriptions
  );

  // Generar alerta automática si es breakdown o delay
  if (['breakdown', 'delay'].includes(incident_type) && service.id_route) {
    await alertRepository.addAlert(
      service.id_route,
      incident_type === 'breakdown' ? 'other' : 'delay',
      incident_type === 'breakdown' ? 'Bus breakdown' : 'Service delay',
      descriptions,
      new Date().toISOString(),
      null
    );
  }

  return incident;
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

module.exports = { 
  getAllIncident, 
  getIncident, 
  addIncident, 
  updateIncident, 
  deleteIncident,

};