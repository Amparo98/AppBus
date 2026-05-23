const alertService = require('../alert/alert_service.js');

async function getAllAlert(req, res, next) {
  try {
    const alerts = await alertService.getAllAlert(req.user.id);
    res.status(200).json({
      ok: true,
      alerts
    });
  } catch (error) {
    next(error);
  }
}

async function getAlert(req, res, next) {
  try {
    const alert = await alertService.getAlert(req.params.id_alert, req.user.id);

    res.status(200).json({
      ok: true,
      alert
    });
  } catch (error) {
    next(error);
  }
}

async function addAlert(req, res, next) {
  try {
    const alert = await alertService.addAlert(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: 'Alert created correctly',
      alert
    });
  } catch (error) {
    next(error);
  }
}

async function updateAlert(req, res, next) {
  try {
    const alert = await alertService.updateAlert(req.params.id_alert, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: 'Alert updated correctly',
      alert
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAlert(req, res, next) {
  try {
    await alertService.deleteAlert(req.params.id_alert, req.user.id);
    res.status(200).json({
      ok: true,
      message: 'Alert deleted correctly'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  getAllAlert,
  getAlert,
  addAlert,
  updateAlert,
  deleteAlert
};