const driverService = require('./driver_service.js');
const i18next = require('../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function getAllDriver(req, res, next) {
  try {
    const driver = await driverService.getAllDriversByCompany(req.user.id);
    res.status(200).json({ 
      ok: true, 
      driver 
    });
  } catch (error) {
    next(error);
  }
}

async function getPendingDrivers(req, res, next) {
  try {
    const driver = await driverService.getDriverPending(req.user.id);
    res.status(200).json({ 
      ok: true, 
      driver 
    });
  } catch (error) {
    next(error);
  }
}

async function getDriver(req, res, next) {
  try {
    const driver = await driverService.getDriverById(
      req.params.id_driver,
      req.user.id
    );

    res.status(200).json({
      ok: true,
      driver
    });
  } catch (error) {
    next(error);
  }
}

async function updateDriverByCompany(req, res, next) {
  try {
    const lang = getLang(req);
    const driver = await driverService.updateDriverByCompany(req.params.id_driver, req.user.id, req.body);
    res.status(200).json({ 
      ok: true, 
      message: i18next.t('driver.updated_successfully', { lng: lang }),
      driver 
    });
  } catch (error) {
    next(error);
  }
}

async function addDriver(req, res, next) {
  try {
    const lang = getLang(req);
    const driver = await driverService.addDriver(req.user.id, req.body);
    res.status(201).json({
      ok: true,
      message: i18next.t('driver.created_successfully', { lng: lang }),
      driver
    });
  } catch (error) {
    next(error);
  }
}

async function activeAccount(req, res, next) {
  try {
    const lang = getLang(req);
    const { token, password } = req.body;
    const driver = await driverService.activeAccount(token, password);
    res.status(200).json({
      ok: true,
      message: i18next.t('driver.active_account', { lng: lang }),
      driver
    });
  } catch (error) {
    next(error);
  }
}

async function deleteDriver(req, res, next) {
  try {
    const lang = getLang(req);
    const driver = await driverService.deleteDriver(req.params.id_driver, req.user.id);
    res.status(200).json({
      ok: true,
      message: i18next.t('driver.deleted_successfully', { lng: lang }),
      driver
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  getAllDriver, 
  getPendingDrivers, 
  getDriver, 
  updateDriverByCompany, 
  addDriver, 
  activeAccount, 
  deleteDriver 
};