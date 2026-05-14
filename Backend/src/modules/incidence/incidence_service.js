const incidenceRepository = require('./incidence_repositories.js');
const { validarTransicion } = require('../../utils/state_transition.js');

const appError = require('../../utils/appError.js');

async function getAllIncidence(company_id) {
  return await incidenceRepository.getIncidenceByCompany(company_id);
}

async function getIncidence(id_incidence, company_id) {
  const incidence = await incidenceRepository.getIncidenceById(id_incidence, company_id);
  if (!incidence) throw appError('INCIDENCE_NOT_FOUND', 404);
  return incidence;
}

async function addIncidence(driver_id, data) {
  const { bus_id, route_id, incidence_type, descriptions } = data;
  return await incidenceRepository.addIncidence(driver_id, bus_id, route_id, incidence_type, descriptions);
}

async function updateIncidence(id_incidence, company_id, data) {
  if (data.states) {
    const incidenceActual = await incidenceRepository.getIncidenceById(id_incidence, company_id);
    if (!incidenceActual) throw appError('INCIDENCE_NOT_FOUND', 404);
    validarTransicion('incidence', incidenceActual.status, data.status);
  }

  const incidence = await incidenceRepository.updateIncidence(id_incidence, company_id, data);
  if (!incidence) throw appError('INCIDENCE_NOT_FOUND', 404);
  return incidence;
}

async function deleteIncidence(id_incidence, company_id) {
  const incidence = await incidenceRepository.deleteIncidence(
    id_incidence,
    company_id
  );

  if (!incidence) {
    throw appError('INCIDENCE_NOT_FOUND', 404);
  }

  return incidence;
}

module.exports = { getAllIncidence, getIncidence, addIncidence, updateIncidence, deleteIncidence };