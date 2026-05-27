const stopService = require('./stop_service');

async function getAllStop(req, res, next) {
  try {
    const stops = await stopService.getAllStops();
    res.status(200).json({ ok: true, stops });
  } catch (error) {
    next(error);
  }
}

async function getStop(req, res, next) {
  try {
    const stop = await stopService.getStop(req.params.id_stop);
    res.status(200).json({ ok: true, stop });
  } catch (error) {
    next(error);
  }
}

async function addStop(req, res, next) {
  try {
    const stop = await stopService.addStop(req.body);
    res.status(201).json({ ok: true, message: 'Stop created correctly', stop });
  } catch (error) {
    next(error);
  }
}

async function updateStop(req, res, next) {
  try {
    const stop = await stopService.updateStop(req.params.id_stop, req.body);
    res.status(200).json({ ok: true, message: 'Stop updated correctly', stop });
  } catch (error) {
    next(error);
  }
}

async function deleteStop(req, res, next) {
  try {
    await stopService.deleteStop(req.params.id_stop);
    res.status(200).json({ ok: true, message: 'Stop deleted correctly' });
  } catch (error) {
    next(error);
  }
}

async function getStopsByRoute(req, res, next) {
  try {
    const stops = await stopService.getStopsByRoute(req.params.id_route);
    res.status(200).json({ ok: true, stops });
  } catch (error) {
    next(error);
  }
}

async function addStopToRoute(req, res, next) {
  try {
    const result = await stopService.addStopToRoute(req.params.id_route, req.body);
    res.status(201).json({ ok: true, message: 'Stop added to route correctly', result });
  } catch (error) {
    next(error);
  }
}

async function removeStopFromRoute(req, res, next) {
  try {
    await stopService.removeStopFromRoute(req.params.id_route_stop);
    res.status(200).json({ ok: true, message: 'Stop removed from route correctly' });
  } catch (error) {
    next(error);
  }
}

async function getArrivalTime(req, res, next) {
  try {
    const result = await stopService.getArrivalTime(req.params.id_stop, req.params.id_route);
    res.status(200).json({ ok: true, result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllStop,
  getStop,
  addStop,
  updateStop,
  deleteStop,
  getStopsByRoute,
  addStopToRoute,
  removeStopFromRoute,
  getArrivalTime
};