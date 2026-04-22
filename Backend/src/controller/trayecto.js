const trayectoService = require('../service/trayecto.js');

async function verTodasTrayectos(req, res, next) {
  try {
    const trayectos = await trayectoService.getTrayectos(req.params.linea_id, req.user.id);
    res.status(200).json({ 
      ok: true, 
      trayectos 
    });
  } catch (error) {
    next(error);
  }
}

async function verTrayecto(req, res, next) {
  try {
    const trayecto = await trayectoService.getTrayecto(req.params.id_trayecto, req.params.linea_id, req.user.id);
    res.status(200).json({ 
      ok: true, 
      trayecto 
    });
  } catch (error) {
    next(error);
  }
}

async function crearTrayecto(req, res, next) {
  try {
    const trayecto = await trayectoService.createTrayecto(req.params.linea_id, req.user.id, req.body); 
    res.status(201).json({ 
      ok: true, 
      trayecto 
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarTrayecto(req, res, next) {
  try {
    const trayecto = await trayectoService.updateTrayecto(req.params.id_trayecto, req.params.linea_id, req.user.id, req.body); 
    res.status(200).json({ 
      ok: true, 
      message: 'Trayecto actualizado correctamente', 
      trayecto 
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarTrayecto(req, res, next) {
  try {
    await trayectoService.deleteTrayecto(req.params.id_trayecto, req.params.linea_id, req.user.id); 
    res.status(200).json({ 
      ok: true, 
      message: 'Trayecto eliminado correctamente' 
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  verTodasTrayectos, 
  verTrayecto, 
  crearTrayecto, 
  actualizarTrayecto, 
  eliminarTrayecto 
};