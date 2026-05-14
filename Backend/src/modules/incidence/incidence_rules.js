const { z } = require('zod');

const addIncidenceRules = z.object({
  bus_id: z.string().uuid('validation.bus.id_invalid'),
  route_id: z.string().uuid('validation.route.id_invalid'),
  incidence_type: z.enum(
    ['breakdown', 'passenger', 'emergency', 'other'],
    { message: 'validation.incidence.type_invalid' }
  ),
  descriptions: z.string().trim().min(1, 'validation.incidence.description_required')
}).strict();

const updateIncidenceRules = z.object({
  states: z.enum(
    ['open', 'in_progress', 'closed'],
    { message: 'validation.incidence.status_invalid' }
  ).optional(),
  descriptions: z.string().trim().min(1, 'validation.incidence.description_required').optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'validation.update.at_least_one_field'
});

module.exports = {
  addIncidenceRules,
  updateIncidenceRules
};