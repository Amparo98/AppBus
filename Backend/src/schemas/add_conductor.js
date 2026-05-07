const { z } = require('zod');

const crearConductorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  dni: z.string().min(9, 'El DNI debe tener al menos 9 caracteres'),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres'),
});

const actualizarConductorSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().min(9).optional(),
  activo: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

const activarCuentaSchema = z.object({
  token: z.string().min(1, 'El token es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

module.exports = { crearConductorSchema, actualizarConductorSchema, activarCuentaSchema };