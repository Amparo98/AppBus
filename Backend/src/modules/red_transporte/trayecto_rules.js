const { z } = require('zod');

const crearTrayectoSchema = z.object({
  //linea_id: z.string().min(1, 'El id de línea es obligatorio'), // Cambiado a string para coincidir con el tipo de dato en la base de datos
  // linea_id: z.number().string().positive('El id de línea es obligatorio'),
  origen: z.string().min(1, 'El origen es obligatorio'),
  destino: z.string().min(1, 'El destino es obligatorio'),
  duracion_estimada: z.number().int().positive('La duración debe ser un número positivo en minutos'),
  activo: z.boolean().default(true),
  sentido: z.enum(['ida', 'vuelta'], { message: 'El sentido debe ser Ida o Vuelta' }),
  
});

const actualizarTrayectoSchema = z.object({
  origen: z.string().min(1).optional(),
  destino: z.string().min(1).optional(),
  duracion_estimada: z.number().int().positive().optional(),
  sentido: z.enum(['Ida', 'Vuelta']).optional(),
  activo: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debes enviar al menos un campo para actualizar'
});

module.exports = { crearTrayectoSchema, actualizarTrayectoSchema };