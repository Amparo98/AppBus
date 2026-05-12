function appError(code, status = 500, details = null) {
  const error = new Error(code);
  error.code = code;
  error.status = status;

  if (details) {
    error.details = details;
  }

  return error;
}

module.exports = appError;