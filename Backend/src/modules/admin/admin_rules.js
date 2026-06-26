const { z } = require('zod');

const idCompanyParamRules = z.object({
  id_company: z.string().uuid('validation.company.id_invalid')
});

module.exports = { idCompanyParamRules };