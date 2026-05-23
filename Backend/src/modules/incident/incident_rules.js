const { z } = require('zod');

const addIncidentRules = z.object({
  bus_id: z.string().uuid('validation.bus.id_invalid'),
  route_id: z.string().uuid('validation.route.id_invalid'),
  incident_type: z.enum(
    ['breakdown', 'passenger', 'emergency', 'other'],
    { message: 'validation.incident.type_invalid' }
  ),
  descriptions: z.string().trim().min(1, 'validation.incident.description_required')
}).strict();

const updateIncidentRules = z.object({
  states: z.enum(
    ['open', 'in_progress', 'closed'],
    { message: 'validation.incident.status_invalid' }
  ).optional(),
  descriptions: z.string().trim().min(1, 'validation.incident.description_required').optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'validation.update.at_least_one_field'
});

module.exports = {
  addIncidentRules,
  updateIncidentRules
};