const { z } = require('zod');

const addStopRules = z.object({
  name_stop: z.string().min(1, 'Name is required'),
  address_stop: z.string().min(1, 'Address is required').optional(),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude')
});

const updateStopRules = z.object({
  name_stop: z.string().min(1).optional(),
  address_stop: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

const addRouteStopRules = z.object({
  stop_id: z.string().uuid('Stop is required'),
  orders: z.number().int().positive('Order must be a positive number')
});

module.exports = { addStopRules, updateStopRules, addRouteStopRules };