const lineaRepository = require('./linea_repositories.js');

async function getLineas(empresa_id) {
  return await lineaRepository.getLineaByEmpresa(empresa_id);
}

async function getLinea(codigo, empresa_id) {
  const linea = await lineaRepository.getLineaById(codigo, empresa_id);
  if (!linea) {
    const error = new Error('Línea no encontrada');
    error.status = 404;
    error.code = 'LINEA_NOT_FOUND';
    throw error;
  }
  return linea;
}

async function createLinea(empresa_id, data) {
  const { nombre, color} = data;
  return await lineaRepository.createLinea(empresa_id, nombre, color);
}

async function updateLinea(codigo, empresa_id, data) {
  const linea = await lineaRepository.updateLinea(codigo, empresa_id, data);
  if (!linea) {
    const error = new Error('Línea no encontrada');
    error.status = 404;
    error.code = 'LINEA_NOT_FOUND';
    throw error;
  }
  return linea;
}

async function deleteLinea(codigo, empresa_id) {
  const linea = await lineaRepository.deleteLinea(codigo, empresa_id);
  if (!linea) {
    const error = new Error('Línea no encontrada');
    error.status = 404;
    error.code = 'LINEA_NOT_FOUND';
    throw error;
  }
}

module.exports = { getLineas, getLinea, createLinea, updateLinea, deleteLinea };