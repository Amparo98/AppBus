const { z } = require('zod');

const addRouteRules = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  estimated_duration: z.number().int().positive('Duration must be a positive number in minutes'),
  is_active: z.boolean().default(true),
  direction: z.enum(['outbound', 'return'], { message: 'Direction must be outbound or return' })
});

const updateRouteRules = z.object({
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  estimated_duration: z.number().int().positive().optional(),
  direction: z.enum(['outbound', 'return']).optional(),
  is_active: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

module.exports = { addRouteRules, updateRouteRules };