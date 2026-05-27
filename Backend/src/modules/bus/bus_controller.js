const { createBus } = require('./bus_repositories.js');
const buService = require('./bus_service.js');
const i18next = require('../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}


async function getAllBuses(req, res, next) {
  try {
    const buses = await buService.getAllBuses(req.user.id);
    res.status(200).json({
      ok: true,
      buses
    });
  } catch (error) {
    next(error);
  }
}

async function getBus(req, res, next) {
  try {
    const bus = await buService.getBus(req.params.id_bus, req.user.id);

    res.status(200).json({
      ok: true,
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function addBus(req, res, next) {
  try {
    const lang = getLang(req);
    const bus = await buService.addBus(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: i18next.t('bus.created_successfully', { lng: lang }),
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function updateBus(req, res, next) {
  try {
    const lang = getLang(req);
    const bus = await buService.updateBus(req.params.id_bus, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: i18next.t('bus.updated_successfully', { lng: lang }),
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function deleteBus(req, res, next) {
  try {
    const lang = getLang(req);
    const bus = await buService.deleteBus(req.params.id_bus, req.user.id);
    res.status(200).json({
      ok: true,
      message: i18next.t('bus.deleted_successfully', { lng: lang }),
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function getActiveBusesByCompany(req, res, next) {
  try {
    const positions = await positionService.getActiveBusesByCompany(req.user.id);
    res.status(200).json({ ok: true, positions });
  } catch (error) {
    next(error);
  } 
}


module.exports = {
  getAllBuses,
  getBus,
  addBus,
  updateBus,
  deleteBus, 
  getActiveBusesByCompany
}