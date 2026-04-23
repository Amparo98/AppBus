const busRepository = require('../repositories/bus.js');
const {validarTransicion} = require('../utils/transiciones.js');

async function getBuses(empresa_id) {
  return await busRepository.getBusByEmpresa(empresa_id);
}

async function getBus(id_bus, empresa_id) {
  const bus = await busRepository.getBusById(id_bus, empresa_id);
  if (!bus) {
    const error = new Error('Bus no encontrado');
    error.status = 404;
    error.code = 'BUS_NOT_FOUND';
    throw error;
  }
  return bus;
}

async function createBus(empresa_id, data) {
  const { matricula } = data;
  const matriculaNormalized = matricula.trim().toUpperCase();

  const exists = await busRepository.existsBusByMatricula(matriculaNormalized, empresa_id);
  if (exists) {
    const error = new Error('Ya existe un bus con esa matrícula');
    error.status = 409;
    error.code = 'MATRICULA_ALREADY_EXISTS';
    throw error;
  }

  return await busRepository.createBus(empresa_id, matriculaNormalized);
}

async function updateBus(id_bus, empresa_id, data) {
  if (data.estado) {
    const busActual = await busRepository.getBusById(id_bus, empresa_id);
    if (!busActual) {
      const error = new Error('Bus no encontrado');
      error.status = 404;
      error.code = 'BUS_NOT_FOUND';
      throw error;
    }
    validarTransicion('bus', busActual.estado, data.estado); // 👈
  }

  const bus = await busRepository.updateBus(id_bus, empresa_id, data);
  if (!bus) {
    const error = new Error('Bus no encontrado');
    error.status = 404;
    error.code = 'BUS_NOT_FOUND';
    throw error;
  }
  return bus;
}

async function deleteBus(id_bus, empresa_id) {
  const bus = await busRepository.deleteBus(id_bus, empresa_id);
  if (!bus) {
    const error = new Error('Bus no encontrado');
    error.status = 404;
    error.code = 'BUS_NOT_FOUND';
    throw error;
  }
}

module.exports = { getBuses, getBus, createBus, updateBus, deleteBus };