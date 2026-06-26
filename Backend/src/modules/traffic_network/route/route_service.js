const routeRepository = require('./route_repositories.js');
const lineRepository = require('../../line/line_repositories.js');
const appError = require('../../../utils/appError.js');

async function checkLine(code, company_id) {
  const line = await lineRepository.getLineById(code, company_id);
  if (!line)  throw appError('LINE_NOT_FOUND', 404);
  return line; 
}

async function getAllRoute(code, company_id) {
  const line = await checkLine(code, company_id);
  return await routeRepository.getRouteByLine(line.id_line);
}

async function getRoute(id_route, code, company_id) {
  const line = await checkLine(code, company_id);
  const route = await routeRepository.getRouteById(id_route, line.id_line);
  if (!route) throw appError('ROUTE_NOT_FOUND', 404);
  return route;
}

async function addRoute(code, company_id, data) {
  const line = await checkLine(code, company_id);
  const { origin, destination, estimated_duration, is_active, direction} = data;
  return await routeRepository.createRoute(line.id_line, origin, destination, estimated_duration, is_active, direction ); 
}

async function updateRoute(id_route, code, company_id, data) {
  const line = await checkLine(code, company_id);
  const route = await routeRepository.updateRoute(id_route, line.id_line, data);
  if (!route) throw appError('ROUTE_NOT_FOUND', 404);
  return route;
}

async function deleteRoute(id_route, code, company_id) {
  const line = await checkLine(code, company_id);
  const route = await routeRepository.deleteRoute(id_route, line.id_line);
  if (!route) throw appError('ROUTE_NOT_FOUND', 404);
  return route;
}

module.exports = { 
  getAllRoute,
  getRoute,
  addRoute,
  updateRoute,
  deleteRoute
};
