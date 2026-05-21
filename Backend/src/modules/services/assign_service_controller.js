const serviceService = require('./assign_service_service.js'); 

async function getAllService(req, res, next) {
  try {
    const services = await serviceService.getAllService(req.user.id);
    res.status(200).json({ ok: true, services });
  } catch (error) {
    next(error);
  }
}

async function getService(req, res, next) {
  try {
    const service = await serviceService.getService(req.params.id_service, req.user.id);
    res.status(200).json({ ok: true, service });
  } catch (error) {
    next(error);
  }
}

async function getServiceDriver(req, res, next) {
  try {
    const { status } = req.query;
    const services = await serviceService.getServiceDriver(req.user.id, status);
    res.status(200).json({ ok: true, services });
  } catch (error) {
    next(error);
  }
}

async function addService(req, res, next) {
  try {
    const service = await serviceService.addService(req.user.id, req.body);
    res.status(201).json({ ok: true, message: 'Service assigned correctly', service });
  } catch (error) {
    next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const service = await serviceService.updateService(req.params.id_service, req.user.id, req.body);
    res.status(200).json({ ok: true, message: 'Service updated correctly', service });
  } catch (error) {
    next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    await serviceService.deleteService(req.params.id_service, req.user.id);
    res.status(200).json({ ok: true, message: 'Service deleted correctly' });
  } catch (error) {
    next(error);
  }
}

async function startService(req, res, next) {
  try {
    const service = await serviceService.startService(req.params.id_service, req.user.id);
    res.status(200).json({ ok: true, message: 'Service started correctly', service });
  } catch (error) {
    next(error);
  }
}

async function finishService(req, res, next) {
  try {
    const service = await serviceService.finishService(req.params.id_service, req.user.id);
    res.status(200).json({ ok: true, message: 'Service finished correctly', service });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  getAllService,
  getService,
  getServiceDriver,
  addService,
  updateService,
  deleteService,
  startService,
  finishService
};