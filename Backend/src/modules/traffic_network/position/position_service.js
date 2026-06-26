const positionRepository = require('./position_repositories.js');
const appError = require('../../../utils/appError.js');

async function savePosition(bus_id, latitude, longitude) {
  return await positionRepository.savePosition(bus_id, latitude, longitude);
}

async function getLastPosition(bus_id) {
  const position = await positionRepository.getLastPosition(bus_id);
  if (!position) throw appError('POSITION_NOT_FOUND', 404);
  return position;
}

async function getLastPositionsByCompany(company_id) {
  return await positionRepository.getLastPositionsByCompany(company_id);
}


module.exports = { 
  savePosition, 
  getLastPosition, 
  getLastPositionsByCompany,
};