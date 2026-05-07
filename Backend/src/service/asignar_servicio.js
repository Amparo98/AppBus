const servicioRepository = require('../repositories/asignar_servicio.js');
const {validarTransicion} = require('../utils/transiciones.js');

async function getServicios(empresa_id) {
  return await servicioRepository.getServiciosByEmpresa(empresa_id);
}

async function getServicio(id_asignacion, empresa_id) {
  const servicio = await servicioRepository.getServicioById(id_asignacion, empresa_id);
  if (!servicio) {
    const error = new Error('Servicio no encontrado');
    error.status = 404;
    error.code = 'SERVICIO_NOT_FOUND';
    throw error;
  }
  return servicio;
}

async function getServiciosConductor(conductor_id, estado) {
  const estadosValidos = ['Programado', 'En curso', 'Completado', 'Cancelado'];

  if (estado && !estadosValidos.includes(estado)) {
    const error = new Error(`Estado inválido. Los valores permitidos son: ${estadosValidos.join(', ')}`);
    error.status = 400;
    error.code = 'INVALID_STATE';
    throw error;
  }

  return await servicioRepository.getServiciosByConductor(conductor_id, estado);
}

async function createServicio(empresa_id, data) {
  const { conductor_id, bus_id, trayecto_id, fecha_inicio, fecha_fin } = data;

  // Verificar que todo pertenece a la empresa
  const pertenencia = await servicioRepository.verificarPertenencia(
    conductor_id, bus_id, trayecto_id, empresa_id
  );

  if (pertenencia.conductor_ok == 0) {
    const error = new Error('El conductor no pertenece a tu empresa');
    error.status = 400;
    error.code = 'CONDUCTOR_NOT_FOUND';
    throw error;
  }
  if (pertenencia.bus_ok == 0) {
    const error = new Error('El bus no pertenece a tu empresa');
    error.status = 400;
    error.code = 'BUS_NOT_FOUND';
    throw error;
  }
  if (pertenencia.trayecto_ok == 0) {
    const error = new Error('El trayecto no pertenece a tu empresa');
    error.status = 400;
    error.code = 'TRAYECTO_NOT_FOUND';
    throw error;
  }

  return await servicioRepository.createServicio(conductor_id, bus_id, trayecto_id, fecha_inicio, fecha_fin);
}

async function updateServicio(id_asignacion, empresa_id, data) {
  if (data.estado) {
    const servicioActual = await servicioRepository.getServicioById(id_asignacion, empresa_id);
    if (!servicioActual) {
      const error = new Error('Servicio no encontrado');
      error.status = 404;
      error.code = 'SERVICIO_NOT_FOUND';
      throw error;
    }
    validarTransicion('servicio', servicioActual.estado, data.estado); // 👈
  }

  const servicio = await servicioRepository.updateServicio(id_asignacion, empresa_id, data);
  if (!servicio) {
    const error = new Error('Servicio no encontrado');
    error.status = 404;
    error.code = 'SERVICIO_NOT_FOUND';
    throw error;
  }
  return servicio;
}

async function deleteServicio(id_asignacion, empresa_id) {
  const servicio = await servicioRepository.deleteServicio(id_asignacion, empresa_id);
  if (!servicio) {
    const error = new Error('Servicio no encontrado');
    error.status = 404;
    error.code = 'SERVICIO_NOT_FOUND';
    throw error;
  }
}

module.exports = { getServicios, getServicio, createServicio, updateServicio, deleteServicio, getServiciosConductor };