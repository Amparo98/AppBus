const i18next = require('../config/i18n.js');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const lang = req.headers['accept-language'] || 'es';

      const error = new Error('VALIDATION_ERROR');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';

      error.details = result.error.issues.map(e => ({
        field: e.path[0],
        message: i18next.t(e.message, {
          lng: lang,
          min: e.minimum
        })
      }));

      return next(error);
    }

    req.params = result.data;
    next();
  };
}

module.exports = validate;