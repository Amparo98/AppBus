const alertRepository = require('./alert_repositories.js');
const appError = require('../../utils/appError.js');

async function getAllAlert(company_id) {
  return await alertRepository.getAlertByCompany(company_id);
}

async function getAlert(id_alert, company_id) {
  const alert = await alertRepository.getAlertById(id_alert, company_id);
  if (!alert) throw appError('ALERT_NOT_FOUND', 404);

  return alert;
}

async function addAlert(company_id, data) {
  const { route_id, alert_type, title, descriptions, starts_date, end_date } = data;
  return await alertRepository.addAlert(route_id, alert_type, title, descriptions, starts_date, end_date);
}

async function updateAlert(id_alert, company_id, data) {
  const alert = await alertRepository.updateAlert(id_alert, company_id, data);
  if (!alert) throw appError('ALERT_NOT_FOUND', 404);
  return alert;
}

async function deleteAlert(id_alert, company_id) {
  const alert = await alertRepository.deleteAlert(id_alert, company_id);
  if (!alert) throw appError('ALERT_NOT_FOUND', 404);
}

module.exports = { 
  getAllAlert,
  getAlert,
  addAlert,
  updateAlert,
  deleteAlert
};