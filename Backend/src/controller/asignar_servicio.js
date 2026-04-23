const servicioService = require('../service/asignar_servicio.js');

async function verServicios(req, res, next) {
  try {
    const servicios = await servicioService.getServicios(req.user.id);
    res.status(200).json({ ok: true, servicios });
  } catch (error) {
    next(error);
  }
}

async function verServicio(req, res, next) {
  try {
    const servicio = await servicioService.getServicio(req.params.id_asignacion, req.user.id);
    res.status(200).json({ ok: true, servicio });
  } catch (error) {
    next(error);
  }
}

async function crearServicio(req, res, next) {
  try {
    const servicio = await servicioService.createServicio(req.user.id, req.body);
    res.status(201).json({ ok: true, message: 'Servicio asignado correctamente', servicio });
  } catch (error) {
    next(error);
  }
}

async function actualizarServicio(req, res, next) {
  try {
    const servicio = await servicioService.updateServicio(req.params.id_asignacion, req.user.id, req.body);
    res.status(200).json({ ok: true, message: 'Servicio actualizado correctamente', servicio });
  } catch (error) {
    next(error);
  }
}

async function eliminarServicio(req, res, next) {
  try {
    await servicioService.deleteServicio(req.params.id_asignacion, req.user.id);
    res.status(200).json({ ok: true, message: 'Servicio eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
    verServicios, 
    verServicio, 
    crearServicio, 
    actualizarServicio, 
    eliminarServicio 
};