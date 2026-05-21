const { z } = require('zod');

const crearAvisoSchema = z.object({
  trayecto_id: z.number().int().positive('El trayecto es obligatorio'),
  tipo_aviso: z.enum(['obras', 'desvio', 'retraso', 'suspension', 'otra']),
  titulo: z.string().min(1, 'El título es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  fecha_inicio: z.string().datetime('Fecha de inicio inválida'),
  fecha_fin: z.string().datetime('Fecha de fin inválida').optional()
}).refine(data => {
  if (data.fecha_fin) {
    return new Date(data.fecha_fin) >= new Date(data.fecha_inicio);
  }
  return true;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fecha_fin']
});

const actualizarAvisoSchema = z.object({
  tipo_aviso: z.enum(['obras', 'desvio', 'retraso', 'suspension', 'otra']).optional(),
  titulo: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
  activo: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

module.exports = { crearAvisoSchema, actualizarAvisoSchema };