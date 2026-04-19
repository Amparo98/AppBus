const lineaService = require('../service/linea.js');

async function verTodasLineas(req, res, next) {
  try {
    const lineas = await lineaService.getLineas(req.user.id);
    res.status(200).json({
      ok: true,
      lineas
    });
  } catch (error) {
    next(error);
  }
}

async function verLinea(req, res, next) {
  try {
    const linea = await lineaService.getLinea(req.params.codigo, req.user.id);

    res.status(200).json({
      ok: true,
      linea
    });
  } catch (error) {
    next(error);
  }
}


async function crearLinea(req, res, next) {
  try {
    const linea = await lineaService.createLinea(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: 'Línea creada correctamente',
      linea
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarLinea(req, res, next) {
  try {
    const linea = await lineaService.updateLinea(req.params.codigo, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: 'Línea actualizada correctamente',
      linea
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarLinea(req, res, next) {
  try {
    await lineaService.deleteLinea(req.params.codigo, req.user.id);
    res.status(200).json({ 
        ok: true, 
        message: 'Línea eliminada correctamente' 
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    verTodasLineas,
    verLinea,
    crearLinea,
    actualizarLinea,
    eliminarLinea,

};