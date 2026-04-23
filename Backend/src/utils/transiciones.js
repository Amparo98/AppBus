const TRANSICIONES_SERVICIO = {
  'Programado':  ['En curso', 'Cancelado'],
  'En curso':    ['Completado', 'Cancelado'],
  'Completado':  [],
  'Cancelado':   []
};

const TRANSICIONES_BUS = {
  'Operativo':         ['En mantenimiento', 'Fuera de servicio'],
  'En mantenimiento':  ['Operativo', 'Fuera de servicio'],
  'Fuera de servicio': []
};

const TRANSICIONES_INCIDENCIA = {
  'abierta':    ['en_proceso', 'cerrada'],
  'en_proceso': ['cerrada'],
  'cerrada':    []
};

function validarTransicion(entidad, estadoActual, estadoNuevo) {
  const mapa = {
    servicio:   TRANSICIONES_SERVICIO,
    bus:        TRANSICIONES_BUS,
    incidencia: TRANSICIONES_INCIDENCIA
  }[entidad];

  if (!mapa) {
    const error = new Error('Entidad no reconocida');
    error.status = 400;
    error.code = 'INVALID_ENTITY';
    throw error;
  }

  const permitidos = mapa[estadoActual] || [];
  if (!permitidos.includes(estadoNuevo)) {
    const error = new Error(
      `Transición inválida: no se puede pasar de '${estadoActual}' a '${estadoNuevo}'`
    );
    error.status = 400;
    error.code = 'INVALID_STATE_TRANSITION';
    error.details = [{ 
      estadoActual, 
      estadoNuevo, 
      permitidos 
    }];
    throw error;
  }
}

module.exports = { validarTransicion };