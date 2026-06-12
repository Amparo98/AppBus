const busRepository = require('./bus_repositories.js');
const {validarTransicion} = require('../../utils/state_transition.js');

const appError = require('../../utils/appError.js');

async function getAllBuses(company_id) {
  return await busRepository.getBusByEmpresa(company_id);
}

async function getBus(id_bus, company_id) {
  const bus = await busRepository.getBusById(id_bus, company_id);
  if (!bus) throw appError('BUS_NOT_FOUND', 404);
  return bus;
}

async function addBus(company_id, data) {
  const { license_plate } = data;
  const licenseNormalized = license_plate.trim().toUpperCase();

  const exists = await busRepository.existsBusByLicensePlate(licenseNormalized, company_id);
  if (exists) throw appError('LICENSE_ALREADY_EXISTS', 409);

  return await busRepository.createBus(company_id, licenseNormalized);
}

async function updateBus(id_bus, company_id, data) {
  if (data.statu) {
    const currentBus = await busRepository.getBusById(id_bus, company_id);
    if (!currentBus) throw appError('BUS_NOT_FOUND', 404);
    validarTransicion('bus', currentBus.statu, data.statu);
  }

  const bus = await busRepository.updateBus(id_bus, company_id, data);
  if (!bus) throw appError('BUS_NOT_FOUND', 404);
  return bus;
}

async function deleteBus(id_bus, company_id) {
  const bus = await busRepository.deleteBus(id_bus, company_id);
  if (!bus) throw appError('BUS_NOT_FOUND', 404);
  return bus;
}

async function getActiveBusesByCompany(company_id) {
  return await busRepository.getActiveBusesByCompany(company_id); // busRepository
}

async function getActiveBusByClient() {
  return await busRepository.getActiveBusByClient();
}

module.exports = { 
  getAllBuses, 
  getBus, 
  addBus, 
  updateBus, 
  deleteBus,
  getActiveBusesByCompany,
  getActiveBusByClient
};