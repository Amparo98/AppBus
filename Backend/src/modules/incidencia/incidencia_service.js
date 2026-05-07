const incidenciaRepository = require('./incidencia_repositories.js');
const { validarTransicion } = require('../../utils/state_transition.js');

async function getIncidencias(empresa_id) {
  return await incidenciaRepository.getIncidenciasByEmpresa(empresa_id);
}

async function getIncidencia(id_incidencia, empresa_id) {
  const incidencia = await incidenciaRepository.getIncidenciaById(id_incidencia, empresa_id);
  if (!incidencia) {
    const error = new Error('Incidencia no encontrada');
    error.status = 404;
    error.code = 'INCIDENCIA_NOT_FOUND';
    throw error;
  }
  return incidencia;
}

async function createIncidencia(conductor_id, data) {
  const { bus_id, trayecto_id, tipo_incidencia, descripcion } = data;
  return await incidenciaRepository.createIncidencia(conductor_id, bus_id, trayecto_id, tipo_incidencia, descripcion);
}

async function updateIncidencia(id_incidencia, empresa_id, data) {
  if (data.estado) {
    const incidenciaActual = await incidenciaRepository.getIncidenciaById(id_incidencia, empresa_id);
    if (!incidenciaActual) {
      const error = new Error('Incidencia no encontrada');
      error.status = 404;
      error.code = 'INCIDENCIA_NOT_FOUND';
      throw error;
    }
    validarTransicion('incidencia', incidenciaActual.estado, data.estado);
  }

  const incidencia = await incidenciaRepository.updateIncidencia(id_incidencia, empresa_id, data);
  if (!incidencia) {
    const error = new Error('Incidencia no encontrada');
    error.status = 404;
    error.code = 'INCIDENCIA_NOT_FOUND';
    throw error;
  }
  return incidencia;
}

module.exports = { getIncidencias, getIncidencia, createIncidencia, updateIncidencia };