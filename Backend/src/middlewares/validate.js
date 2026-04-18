function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error('Datos de entrada inválidos');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      // Extrae los mensajes de Zod en un array legible
      error.details = result.error.issues.map(e => ({
        field: e.path[0],
        message: e.message
      }));
      return next(error);
    }

    req.body = result.data; // datos ya validados y limpios
    next();
  };
}

module.exports = validate;