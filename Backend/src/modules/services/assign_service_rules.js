const { z } = require('zod');

const addServiceRules = z.object({
  driver_id: z.string().uuid('Driver is required'),
  bus_id: z.string().uuid('Bus is required'),
  line_id: z.string().uuid('Line is required'),
  shift: z.enum(['morning', 'afternoon', 'night']),
  service_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD')
});

const updateRules = z.object({
  shift: z.enum(['morning', 'afternoon', 'night']).optional(),
  service_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

module.exports = { addServiceRules, updateRules };
