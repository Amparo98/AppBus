const { z } = require('zod');

const loginRules = z.object({
  email: z.string().email('validation.email.invalid'),
  /*password: z.string().min(6, 'validation.password.min')*/
  /*ahora se pone 3 para un control mas facil, pero despues ene le resultado final tiene q ser 6*/
  password: z.string().min(6, 'validation.password.min')
}).strict();

//Sirve para permitir que un campo opcional pueda venir como cadena vacía "". -> or(z.literal(''))

const registerClientRules = z.object({
  name: z.string().trim().min(2, 'validation.name.min'),
  first_surname: z.string().trim().min(2, 'validation.surname.min'),
  second_surname: z.string().trim().min(2, 'validation.surname.min').optional().or(z.literal('')),
  email: z.string().email('validation.email.invalid'),
  password: z.string().min(6, 'validation.password.min')
}).strict();

const registerCompanyRules = z.object({
  name: z.string().trim().min(2, 'validation.name.min'),
  email: z.string().email('validation.email.invalid'),
  password: z.string().min(6, 'validation.password.min')
}).strict();

module.exports = { loginRules, registerClientRules, registerCompanyRules };