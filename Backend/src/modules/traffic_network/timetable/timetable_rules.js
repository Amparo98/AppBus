const { z } = require('zod');

const addTimetableRules = z.object({
  route_id: z.string().uuid('Route is required'),
  stop_id: z.string().uuid('Stop is required'),
  arrival_time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM'),
  departure_time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM'),
  day_type: z.enum(['L-V', 'sabado', 'domingo', 'festivo'], {
    message: 'Day type must be L-V, sabado, domingo or festivo'
  })
}).refine(data => data.departure_time >= data.arrival_time, {
  message: 'Departure time must be after arrival time',
  path: ['departure_time']
});

module.exports = { addTimetableRules };