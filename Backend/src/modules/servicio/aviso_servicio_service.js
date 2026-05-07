const avisoRepository = require('./aviso_servicio_repositories.js');

async function getAvisos(empresa_id) {
  return await avisoRepository.getAvisosByEmpresa(empresa_id);
}

async function getAviso(id_aviso, empresa_id) {
  const aviso = await avisoRepository.getAvisoById(id_aviso, empresa_id);
  if (!aviso) {
    const error = new Error('Aviso no encontrado');
    error.status = 404;
    error.code = 'AVISO_NOT_FOUND';
    throw error;
  }
  return aviso;
}

async function createAviso(empresa_id, data) {
  const { trayecto_id, tipo_aviso, titulo, descripcion, fecha_inicio, fecha_fin } = data;
  return await avisoRepository.createAviso(trayecto_id, tipo_aviso, titulo, descripcion, fecha_inicio, fecha_fin);
}

async function updateAviso(id_aviso, empresa_id, data) {
  const aviso = await avisoRepository.updateAviso(id_aviso, empresa_id, data);
  if (!aviso) {
    const error = new Error('Aviso no encontrado');
    error.status = 404;
    error.code = 'AVISO_NOT_FOUND';
    throw error;
  }
  return aviso;
}

async function deleteAviso(id_aviso, empresa_id) {
  const aviso = await avisoRepository.deleteAviso(id_aviso, empresa_id);
  if (!aviso) {
    const error = new Error('Aviso no encontrado');
    error.status = 404;
    error.code = 'AVISO_NOT_FOUND';
    throw error;
  }
}

module.exports = { getAvisos, getAviso, createAviso, updateAviso, deleteAviso };