const i18next = require('../config/i18n');

function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';

  if (status === 500) {
    console.error(`[ERROR] ${err.message}`, err.stack);
  }

  const lang = req.headers['accept-language'] || 'es';

  res.status(status).json({
    ok: false,
    code,
    message: i18next.t(`errors.${code}`, { lng: lang }),
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorMiddleware;
/*
El stack trace te dice exactamente en qué archivo y línea ocurrió el error, muy útil 
mientras desarrollas. Pero en producción no debes exponerlo porque revela la estructura 
interna de tu código a quien haga la petición.*/


