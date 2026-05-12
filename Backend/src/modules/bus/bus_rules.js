const { z } = require('zod');

const busStatus = z.enum(['Operativo', 'En mantenimiento', 'Fuera de servicio']);

const licensePlateRegex = /^[0-9]{4}[A-Z]{3}$/;

const addBusRules = z.object({
  license_plate: z
    .string()
    .trim()
    .toUpperCase()
    .regex(licensePlateRegex, 'validation.bus.license_plate_invalid')
}).strict();

const updateBusRules = z.object({
  license_plate: z
    .string()
    .trim()
    .toUpperCase()
    .regex(licensePlateRegex, 'validation.bus.license_plate_invalid')
    .optional(),

  statu: busStatus.optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'validation.update.at_least_one_field'
});

module.exports = {
  addBusRules,
  updateBusRules
};