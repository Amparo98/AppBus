const buService = require('../service/bus');

async function verTodosBuses(req, res, next) {
  try {
    const buses = await buService.getBuses(req.user.id);
    res.status(200).json({
      ok: true,
      buses
    });
  } catch (error) {
    next(error);
  }
}

async function verBus(req, res, next) {
  try {
    const bus = await buService.getBus(req.params.id_bus, req.user.id);

    res.status(200).json({
      ok: true,
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function crearBus(req, res, next) {
  try {
    const bus = await buService.createBus(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: 'Bus creado correctamente',
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarBus(req, res, next) {
  try {
    const bus = await buService.updateBus(req.params.id_bus, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: 'Bus actualizado correctamente',
      bus
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarBus(req, res, next) {
  try {
    const bus = await buService.deleteBus(req.params.id_bus, req.user.id);
    res.status(200).json({
      ok: true,
      message: 'Bus eliminado correctamente',
      bus
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verTodosBuses,
  verBus,
  crearBus,
  actualizarBus,
  eliminarBus
}