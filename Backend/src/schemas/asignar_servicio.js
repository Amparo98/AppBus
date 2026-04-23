const { z } = require('zod');

const crearServicioSchema = z.object({
  conductor_id: z.string().uuid('El conductor es obligatorio'),
  bus_id: z.string().uuid('El bus es obligatorio'),
  trayecto_id: z.string().uuid('El trayecto es obligatorio'),
  fecha_inicio: z.string().datetime('La fecha de inicio debe ser una fecha válida'),
  fecha_fin: z.string().datetime('La fecha de fin debe ser una fecha válida')
}).refine(data => new Date(data.fecha_fin) > new Date(data.fecha_inicio), {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['fecha_fin']
});

//la fecha de fin puede ser la misma porque el servicio puede durar un día,
// por ejemplo, de 8:00 a 16:00 del mismo día, entonces se permite que la fecha 
// de fin sea igual a la fecha de inicio, pero con una hora diferente. Por lo tanto,
// se ajusta la validación para permitir que la fecha de fin sea igual a la fecha de
// inicio siempre y cuando la hora de fin sea posterior a la hora de inicio.

const actualizarServicioSchema = z.object({
  conductor_id: z.string().uuid().optional(),
  bus_id: z.string().uuid().optional(),
  trayecto_id: z.string().uuid().optional(),
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
  estado: z.enum(['Programado', 'En curso', 'Completado', 'Cancelado']).optional()
}).refine(data => new Date(data.fecha_fin) > new Date(data.fecha_inicio), {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['fecha_fin']
});
module.exports = { crearServicioSchema, actualizarServicioSchema };
