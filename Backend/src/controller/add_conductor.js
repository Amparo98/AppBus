const add_conductorService = require('../service/add_conductor.js');

async function verTodosConductores(req, res, next) {
  try {
    const conductores = await add_conductorService.getConductores(req.user.id);
    res.status(200).json({ ok: true, conductores });
  } catch (error) {
    next(error);
  }
}

async function verConductoresPendientes(req, res, next) {
  try {
    const conductores = await add_conductorService.getConductoresPendientes(req.user.id);
    res.status(200).json({ ok: true, conductores });
  } catch (error) {
    next(error);
  }
}

async function verConductor(req, res, next) {
  try {
    const conductor = await add_conductorService.getConductor(req.params.id_conductor, req.user.id);
    res.status(200).json({ ok: true, conductor });
  } catch (error) {
    next(error);
  }
}

async function actualizarConductorEmpresa(req, res, next) {
  try {
    const conductor = await add_conductorService.updateConductorEmpresa(req.params.id_conductor, req.user.id, req.body);
    res.status(200).json({ ok: true, message: 'Conductor actualizado correctamente', conductor });
  } catch (error) {
    next(error);
  }
}

async function agregarConductor(req, res, next) {
  try {
    const conductor = await add_conductorService.agregarConductor(req.user.id, req.body);
    res.status(201).json({
      ok: true,
      message: 'Conductor creado correctamente, se ha enviado un email de activación',
      conductor
    });
  } catch (error) {
    next(error);
  }
}

async function activarCuenta(req, res, next) {
  try {
    const { token, password } = req.body;
    const conductor = await add_conductorService.activarCuenta(token, password);
    res.status(200).json({
      ok: true,
      message: 'Cuenta activada correctamente',
      conductor
    });
  } catch (error) {
    next(error);
  }
}

async function  eliminarConductor(req, res, next) {
  try {
    const conductor = await add_conductorService.eliminarConductor(req.params.id, req.user.id);
    res.status(200).json({
      ok: true,
      message: 'Conductor eliminado correctamente',
      conductor
    });
  } catch (error) {
    next(error);
  }
}
async function eliminarConductor(req, res, next) {
  try {
    await add_conductorService.deleteConductor(req.params.id_conductor, req.user.id);
    res.status(200).json({ ok: true, message: 'Conductor eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { agregarConductor, verTodosConductores, verConductoresPendientes, verConductor, actualizarConductorEmpresa, activarCuenta, eliminarConductor };