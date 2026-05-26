const shiftLogService = require('./shift_log_service.js');
const i18next = require('../../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function getOpenShift(req, res, next) {
  try {
    const shift = await shiftLogService.getOpenShift(req.user.id);
    res.status(200).json({ ok: true, shift });
  } catch (error) {
    next(error);
  }
}

async function getActiveShifts(req, res, next) {
  try {
    const shifts = await shiftLogService.getActiveShifts(req.user.id);
    res.status(200).json({ ok: true, shifts });
  } catch (error) {
    next(error);
  }
}

async function getShiftsByDriver(req, res, next) {
  try {
    const shifts = await shiftLogService.getShiftsByDriver(req.user.id);
    res.status(200).json({ ok: true, shifts });
  } catch (error) {
    next(error);
  }
}

async function startShift(req, res, next) {
  try {
    const lang = getLang(req);
    const shift = await shiftLogService.startShift(req.user.id);
    res.status(201).json({
      ok: true,
      message: i18next.t('shift_log.started', { lng: lang }),
      shift
    });
  } catch (error) {
    next(error);
  }
}

async function endShift(req, res, next) {
  try {
    const lang = getLang(req);
    const shift = await shiftLogService.endShift(req.user.id);
    res.status(200).json({
      ok: true,
      message: i18next.t('shift_log.ended', { lng: lang }),
      shift
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOpenShift,
  getActiveShifts,
  getShiftsByDriver,
  startShift,
  endShift
};