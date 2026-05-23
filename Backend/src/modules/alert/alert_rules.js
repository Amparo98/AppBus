const { z } = require('zod');

const addAlertRules = z.object({
  route_id: z.string().uuid('Route is required'),
  alert_type: z.enum(['roadworks', 'detour', 'delay', 'suspension', 'other'], {
    message: 'Alert type must be roadworks, detour, delay, suspension or other'
  }),
  title: z.string().min(1, 'Title is required'),
  descriptions: z.string().min(1, 'Description is required'),
  starts_date: z.string().datetime('Invalid start date'),
  end_date: z.string().datetime('Invalid end date').optional()
}).refine(data => {
  if (data.end_date) {
    return new Date(data.end_date) >= new Date(data.starts_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date']
});

const updateAlertRules = z.object({
  alert_type: z.enum(['roadworks', 'detour', 'delay', 'suspension', 'other']).optional(),
  title: z.string().min(1).optional(),
  descriptions: z.string().min(1).optional(),
  starts_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  is_active: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

module.exports = { addAlertRules, updateAlertRules };