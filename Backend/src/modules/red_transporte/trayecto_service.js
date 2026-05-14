const trayectoRepository = require('./trayecto_repositories.js');
const lineaRepository = require('../line/line_repositories.js');

async function verificarLinea(codigo, empresa_id) {
  const linea = await lineaRepository.getLineaById(codigo, empresa_id);
  if (!linea) {
    const error = new Error('Línea no encontrada o no pertenece a tu empresa');
    error.status = 404;
    error.code = 'LINEA_NOT_FOUND';
    throw error;
  }
  return linea; 
}

async function getTrayectos(codigo, empresa_id) {
  const linea = await verificarLinea(codigo, empresa_id);
  return await trayectoRepository.getTrayectosByLinea(linea.id_linea);
}

async function getTrayecto(id_trayecto, codigo, empresa_id) {
  const linea = await verificarLinea(codigo, empresa_id);
  const trayecto = await trayectoRepository.getTrayectoById(id_trayecto, linea.id_linea);
  if (!trayecto) {
    const error = new Error('Trayecto no encontrado');
    error.status = 404;
    error.code = 'TRAYECTO_NOT_FOUND';
    throw error;
  }
  return trayecto;
}

async function createTrayecto(codigo, empresa_id, data) {
  const linea = await verificarLinea(codigo, empresa_id);
  const { origen, destino, duracion_estimada, activo, sentido = true } = data;
  return await trayectoRepository.createTrayecto(linea.id_linea, origen, destino, duracion_estimada, activo, sentido); 
}

async function updateTrayecto(id_trayecto, codigo, empresa_id, data) {
  const linea = await verificarLinea(codigo, empresa_id);
  const trayecto = await trayectoRepository.updateTrayecto(id_trayecto, linea.id_linea, data);
  if (!trayecto) {
    const error = new Error('Trayecto no encontrado');
    error.status = 404;
    error.code = 'TRAYECTO_NOT_FOUND';
    throw error;
  }
  return trayecto;
}

async function deleteTrayecto(id_trayecto, codigo, empresa_id) {
  const linea = await verificarLinea(codigo, empresa_id);
  const trayecto = await trayectoRepository.deleteTrayecto(id_trayecto, linea.id_linea);
  if (!trayecto) {
    const error = new Error('Trayecto no encontrado');
    error.status = 404;
    error.code = 'TRAYECTO_NOT_FOUND';
    throw error;
  }
}

module.exports = { 
  getTrayectos, 
  getTrayecto, 
  createTrayecto, 
  updateTrayecto, 
  deleteTrayecto };
