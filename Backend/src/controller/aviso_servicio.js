const avisoServicioService = require('../service/aviso_servicio.js');

async function verAvisos(req, res, next) {
  try {
    const avisos = await avisoServicioService.getAvisos(req.user.id);
    res.status(200).json({
      ok: true,
      avisos
    });
  } catch (error) {
    next(error);
  }
}

async function verAviso(req, res, next) {
  try {
    const aviso = await avisoServicioService.getAviso(req.params.id_aviso, req.user.id);

    res.status(200).json({
      ok: true,
      aviso
    });
  } catch (error) {
    next(error);
  }
}

async function crearAviso(req, res, next) {
  try {
    const aviso = await avisoServicioService.createAviso(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: 'Aviso creado correctamente',
      aviso
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarAviso(req, res, next) {
  try {
    const aviso = await avisoServicioService.updateAviso(req.params.id_aviso, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: 'Aviso actualizado correctamente',
      aviso
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarAviso(req, res, next) {
  try {
    await avisoServicioService.deleteAviso(req.params.id_aviso, req.user.id);
    res.status(200).json({
      ok: true,
      message: 'Aviso eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { verAvisos, verAviso, crearAviso, actualizarAviso, eliminarAviso };