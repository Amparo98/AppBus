const { z } = require('zod');

const crearLineaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un hex válido ej: #FF0000'),
});

const actualizarLineaSchema = z.object({
  nombre: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

module.exports = { crearLineaSchema, actualizarLineaSchema };