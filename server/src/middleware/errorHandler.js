export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.path}`);
  error.statusCode = 404;
  error.publicMessage = 'The requested endpoint was not found.';
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = Number(error.statusCode) ||
    (error.name === 'ValidationError' || error.type === 'entity.parse.failed' ? 400 :
      error.type === 'entity.too.large' ? 413 : 500);
  const message = error.publicMessage ||
    (error.type === 'entity.parse.failed' ? 'Request body must contain valid JSON.' :
      error.type === 'entity.too.large' ? 'Request body is too large.' :
        error.name === 'ValidationError' ? 'The request data could not be saved.' :
          statusCode === 500 ? 'An unexpected server error occurred.' : error.message);

  if (statusCode >= 500) {
    console.error(`API error (${error.name || 'Error'}): ${message}`);
  }
  res.status(statusCode).json({ error: { message } });
}
