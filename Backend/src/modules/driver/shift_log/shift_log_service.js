const shiftLogRepository = require('./shift_log_repositories.js');
const appError = require('../../../utils/appError.js');

async function getOpenShift(driver_id) {
  const shift = await shiftLogRepository.getOpenShift(driver_id);
  if (!shift) throw appError('SHIFT_NOT_FOUND', 404);
  return shift;
}

async function getActiveShifts(company_id) {
  return await shiftLogRepository.getActiveShifts(company_id);
}

async function getShiftsByDriver(driver_id) {
  return await shiftLogRepository.getShiftsByDriver(driver_id);
}

async function startShift(driver_id) {
  // Verificar que no hay jornada abierta
  const openShift = await shiftLogRepository.getOpenShift(driver_id);
  if (openShift) throw appError('SHIFT_ALREADY_STARTED', 409);

  return await shiftLogRepository.startShift(driver_id);
}

async function endShift(driver_id) {
  // Verificar que hay jornada abierta
  const openShift = await shiftLogRepository.getOpenShift(driver_id);
  if (!openShift) throw appError('SHIFT_NOT_STARTED', 409);

  return await shiftLogRepository.endShift(driver_id);
}

module.exports = {
  getOpenShift,
  getActiveShifts,
  getShiftsByDriver,
  startShift,
  endShift
};