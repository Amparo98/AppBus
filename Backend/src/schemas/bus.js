const {z} = require ('zod');

const estadoEnum = z.enum(['Operativo', 'En mantenimiento', 'Fuera de servicio']);

const crearBusSchema = z.object({
  matricula: z.string().min(1, 'La matrícula es obligatoria')
});

const actualizarBusSchema = z.object({
  matricula: z.string().min(1).optional(),
  en_servicio: estadoEnum.optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

module.exports = { crearBusSchema, actualizarBusSchema };