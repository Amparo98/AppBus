const serviceRepository = require('./assign_service_repositories.js');
const {validateTransition} = require('../../utils/state_transition.js');

const appError = require('../../utils/appError.js');

async function getAllService(company_id) {
  return await serviceRepository.getServiceByCompany(company_id);
}

async function getService(id_service, company_id) {
  const service = await serviceRepository.getServiceById(id_service, company_id);
  if (!service) throw appError('SERVICE_NOT_FOUND', 404); 
  return service;
}

async function getServiceDriver(driver_id, status) {
  const validStates = ['scheduled', 'in_progress', 'completed', 'cancelled'];

  if (status && !validStates.includes(status)) throw appError('INVALED_STATUS', 400); 

  return await serviceRepository.getServiceByDriver(driver_id, status);
}

async function addService(company_id, data) {
  const { driver_id, bus_id, line_id, shift, service_date } = data;

  // Verificar que todo pertenece a la empresa
  const membership = await serviceRepository.membershipByCompany(driver_id, bus_id, line_id, company_id);

  console.log('membership:', membership);

  if (membership.driver_ok == 0)  throw appError('DRIVER_NOT_FOUND', 400);
  if (membership.line_ok == 0) throw appError('LINE_NOT_FOUND', 400);
  if (membership.bus_ok == 0) throw appError('BUS_NOT_FOUND', 400); 

  const exists = await serviceRepository.existsService(driver_id, shift, service_date);
  if (exists) throw appError('SERVICE_ALREADY_EXISTS', 409);

  return await serviceRepository.addService(driver_id, bus_id, line_id, shift, service_date);
}

async function updateService(id_service, company_id, data) {
  if (data.status) {
    const serviceCurrent = await serviceRepository.getServiceById(id_service, company_id);
    if (!serviceCurrent) throw appError('SERVICE_NOT_FOUND', 404); 
    validateTransition('service', serviceCurrent.status, data.status); 
  }

  const service = await serviceRepository.updateService(id_service, company_id, data);
  if (!service) throw appError('SERVICE_NOT_FOUND', 404); 
  return service;
}

async function deleteService(id_service, company_id) {
  const service = await serviceRepository.deleteService(id_service, company_id);
  if (!service) throw appError('SERVICE_NOT_FOUND', 404); 
}

async function startService(id_service, driver_id) {
  const service = await serviceRepository.getServiceById(id_service, driver_id);
  if (!service) throw appError('SERVICE_NOT_FOUND', 404);

  validateTransition('service', service.status, 'in_progress');

  const updated = await serviceRepository.startService(id_service, driver_id);
  if (!updated) throw appError('SERVICE_NOT_FOUND', 404);
  return updated;
}

async function finishService(id_service, driver_id) {
  const service = await serviceRepository.getServiceById(id_service, driver_id);
  if (!service) throw appError('SERVICE_NOT_FOUND', 404);

  validateTransition('service', service.status, 'completed');

  const updated = await serviceRepository.finishService(id_service, driver_id);
  if (!updated) throw appError('SERVICE_NOT_FOUND', 404);
  return updated;
}

module.exports = { 
  getAllService, 
  getService,
  addService,
  updateService,
  deleteService,
  getServiceDriver,
  startService,
  finishService
};