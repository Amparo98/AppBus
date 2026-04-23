const incidenciaService = require('../service/incidencia.js');

async function verIncidencias(req, res, next) {
  try {
    const incidencias = await incidenciaService.getIncidencias(req.user.id);
    res.status(200).json({
      ok: true,
      incidencias
    });
  } catch (error) {
    next(error);
  }
}

async function verIncidencia(req, res, next) {
  try {
    const incidencia = await incidenciaService.getIncidencia(req.params.id_incidencia, req.user.id);

    res.status(200).json({
      ok: true,
      incidencia
    });
  } catch (error) {
    next(error);
  }
}

async function crearIncidencia(req, res, next) {
  try {
    const incidencia = await incidenciaService.createIncidencia(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: 'Incidencia creada correctamente',
      incidencia
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarIncidencia(req, res, next) {
  try {
    const incidencia = await incidenciaService.updateIncidencia(req.params.id_incidencia, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: 'Incidencia actualizada correctamente',
      incidencia
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarIncidencia(req, res, next) {
  try {
    await incidenciaService.deleteIncidencia(req.params.id_incidencia, req.user.id);
    res.status(200).json({
      ok: true,
      message: 'Incidencia eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { verIncidencias, verIncidencia, crearIncidencia, actualizarIncidencia, eliminarIncidencia };