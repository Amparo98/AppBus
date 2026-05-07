const { z } = require('zod');

const crearIncidenciaSchema = z.object({
  bus_id: z.number().int().positive('El bus es obligatorio'),
  trayecto_id: z.number().int().positive('El trayecto es obligatorio'),
  tipo_incidencia: z.enum(['averia', 'pasajero', 'emergencia', 'otra']),
  descripcion: z.string().min(1, 'La descripción es obligatoria')
});

const actualizarIncidenciaSchema = z.object({
  estado: z.enum(['abierta', 'en_proceso', 'cerrada']).optional(),
  descripcion: z.string().min(1).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

module.exports = { crearIncidenciaSchema, actualizarIncidenciaSchema };