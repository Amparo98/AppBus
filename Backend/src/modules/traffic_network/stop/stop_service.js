const stopRepository = require('./stop_repositories.js');
const appError = require('../../../utils/appError.js');

// Fórmula Haversine para calcular distancia entre dos puntos GPS
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distancia en km
}

// Paradas globales
async function getAllStops() {
  return await stopRepository.getAllStops();
}

async function getStop(id_stop) {
  const stop = await stopRepository.getStopById(id_stop);
  if (!stop) throw appError('STOP_NOT_FOUND', 404);
  return stop;
}

async function addStop(data) {
  const { name_stop, address_stop, latitude, longitude } = data;
  return await stopRepository.createStop(name_stop, address_stop, latitude, longitude);
}

async function updateStop(id_stop, data) {
  const stop = await stopRepository.updateStop(id_stop, data);
  if (!stop) throw appError('STOP_NOT_FOUND', 404);
  return stop;
}

async function deleteStop(id_stop) {
  const stop = await stopRepository.deleteStop(id_stop);
  if (!stop) throw appError('STOP_NOT_FOUND', 404);
}

// Paradas de un trayecto
async function getStopsByRoute(route_id) {
  return await stopRepository.getStopsByRoute(route_id);
}

async function addStopToRoute(route_id, data) {
  const { stop_id, orders } = data;

  // Verificar que la parada existe
  const stop = await stopRepository.getStopById(stop_id);
  if (!stop) throw appError('STOP_NOT_FOUND', 404);

  return await stopRepository.addStopToRoute(route_id, stop_id, orders);
}

async function removeStopFromRoute(id_route_stop) {
  const result = await stopRepository.removeStopFromRoute(id_route_stop);
  if (!result) throw appError('ROUTE_STOP_NOT_FOUND', 404);
}

// Tiempo estimado de llegada usando Haversine
async function getArrivalTime(id_stop, route_id) {
  // Obtener coordenadas de la parada
  const stop = await stopRepository.getStopById(id_stop);
  if (!stop) throw appError('STOP_NOT_FOUND', 404);

  // Obtener posición actual del bus en ese trayecto
  const busPosition = await stopRepository.getBusPositionByRoute(route_id);
  if (!busPosition) {
    return { 
      estimated_minutes: null, 
      message: 'No active bus found for this route' 
    };
  }

  // Calcular distancia con Haversine
  const distanceKm = haversine(
    busPosition.latitude, busPosition.longitude,
    stop.latitude, stop.longitude
  );

  // Estimar tiempo con velocidad media urbana de 30 km/h
  const estimatedMinutes = Math.round((distanceKm / 30) * 60);

  return {
    estimated_minutes: estimatedMinutes,
    distance_km: Math.round(distanceKm * 100) / 100,
    bus_last_update: busPosition.fecha
  };
}

module.exports = {
  getAllStops,
  getStop,
  addStop,
  updateStop,
  deleteStop,
  getStopsByRoute,
  addStopToRoute,
  removeStopFromRoute,
  getArrivalTime
};