const { z } = require('zod');

const addLineRules = z.object({
  name_line: z.string().trim().min(1, 'validation.line.name_required'),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'validation.line.color_invalid')
}).strict();

const updateLineRules = z.object({
  name_line: z.string().trim().min(1, 'validation.line.name_required').optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'validation.line.color_invalid')
    .optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'validation.update.at_least_one_field'
});

module.exports = {
  addLineRules,
  updateLineRules
};