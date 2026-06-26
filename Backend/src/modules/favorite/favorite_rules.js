const { z } = require('zod');

const addFavoriteRules = z.object({
  stop_id: z.string().uuid('Stop is required'),
  route_id: z.string().uuid('Route is required')
}).strict();

module.exports = { addFavoriteRules };