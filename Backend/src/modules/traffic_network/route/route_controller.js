const routeService = require('./route_service.js');

async function getAllRoute(req, res, next) {
  try {
    const route = await routeService.getAllRoute(req.params.line_id, req.user.id);
    res.status(200).json({ 
      ok: true, 
      route 
    });
  } catch (error) {
    next(error);
  }
}

async function getRoute(req, res, next) {
  try {
    const route = await routeService.getRoute(req.params.id_route, req.params.line_id, req.user.id);
    res.status(200).json({ 
      ok: true, 
      route 
    });
  } catch (error) {
    next(error);
  }
}

async function addRoute(req, res, next) {
  try {
    const route = await routeService.addRoute(req.params.line_id, req.user.id, req.body); 
    res.status(201).json({ 
      ok: true, 
      route 
    });
  } catch (error) {
    next(error);
  }
}

async function updateRoute(req, res, next) {
  try {
    const route = await routeService.updateRoute(req.params.id_route, req.params.line_id, req.user.id, req.body); 
    res.status(200).json({ 
      ok: true, 
      route 
    });
  } catch (error) {
    next(error);
  }
}

async function deleteRoute(req, res, next) {
  try {
    const route = await routeService.deleteRoute(req.params.id_route, req.params.line_id, req.user.id); 
    res.status(200).json({ 
      ok: true, 
      route
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  getAllRoute,
  getRoute,
  addRoute,
  updateRoute,
  deleteRoute
};