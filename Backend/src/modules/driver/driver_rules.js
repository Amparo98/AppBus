const { z } = require('zod');

const addDriverRules = z.object({
  name: z.string().trim().min(2, 'validation.name.min'),
  first_surname: z.string().trim().min(2, 'validation.surname.min'),
  second_surname: z.string().trim().min(2, 'validation.surname.min').optional().or(z.literal('')),
  dni: z.string().min(9, 'validation.dni.min'),
  phone_number: z.string().min(9, 'validation.phone.min'),
  personal_email: z.string().email('validation.email.invalid')
}); 

const updateDriverRules = z.object({
  full_name: z.string().min(1).optional(), 
  first_surname: z.string().min(1).optional(),
  phone_number: z.string().min(9).optional(),
  is_active: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'validation.update.at_least_one_field'
});

const activateAccountRules = z.object({
  token: z.string().min(1, 'validation.token.required'),
  password: z.string().min(6, 'validation.password.min')
});

module.exports = { addDriverRules, updateDriverRules, activateAccountRules };