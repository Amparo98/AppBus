  const positionService = require('./position_service.js');

  async function savePosition(req, res, next) {
    try {
      const { bus_id, latitude, longitude } = req.body;
      const position = await positionService.savePosition(bus_id, latitude, longitude);
      res.status(201).json({ ok: true, position });
    } catch (error) {
      next(error);
    }
  }

  async function getLastPosition(req, res, next) {
    try {
      const position = await positionService.getLastPosition(req.params.id_bus);
      res.status(200).json({ ok: true, position });
    } catch (error) {
      next(error);
    }
  }

  async function getLastPositionsByCompany(req, res, next) {
    try {
      const positions = await positionService.getLastPositionsByCompany(req.user.id);
      res.status(200).json({ ok: true, positions });
    } catch (error) {
      next(error);
    }
  }

  module.exports = { 
    savePosition, 
    getLastPosition, 
    getLastPositionsByCompany,
  };