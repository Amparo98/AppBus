function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;

  if (status === 500) {
    console.error(`[ERROR] ${err.message}`, err.stack);
  }

  res.status(status).json({
    ok: false,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Error interno del servidor',
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorMiddleware;
/*
El stack trace te dice exactamente en qué archivo y línea ocurrió el error, muy útil 
mientras desarrollas. Pero en producción no debes exponerlo porque revela la estructura 
interna de tu código a quien haga la petición.*/