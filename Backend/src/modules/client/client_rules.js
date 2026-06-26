const { z } = require('zod');

const updateProfileRules = z.object({
  full_name: z.string().trim().min(2, 'validation.name.min').optional(),
  first_surname: z.string().trim().min(2, 'validation.surname.min').optional(),
  second_surname: z.string().trim().min(2, 'validation.surname.min').optional().or(z.literal('')),
  email: z.string().email('validation.email.invalid').optional(),
  avatar_url: z.string().url('validation.avatar.invalid').optional().nullable()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'validation.update.at_least_one_field'
});

const updatePasswordRules = z.object({
  current_password: z.string().min(6, 'validation.password.min'),
  new_password: z.string().min(6, 'validation.password.min')
}).strict();

module.exports = { updateProfileRules, updatePasswordRules };