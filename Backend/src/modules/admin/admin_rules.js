const { z } = require('zod');

const requestAccessCompanyRules = z.object({
name: z.string().trim().min(2),
email: z.string().email()
}).strict();

const activateCompanyRules = z.object({
token: z.string().min(1),
password: z.string().min(6)
}).strict();

const idCompanyParamRules = z.object({
  id_company: z.string().uuid('validation.company.id_invalid')
});


module.exports = { requestAccessCompanyRules, activateCompanyRules, idCompanyParamRules };