const { z } = require('zod');

const savePositionRules = z.object({
  bus_id: z.string().uuid('Bus is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude')
});

module.exports = { savePositionRules };