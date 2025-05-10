const loggerMiddleware = (appEnv = 'production') => {
  return (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

    if (Object.keys(req.body || {}).length > 0 && appEnv !== 'production') {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }

    next();
  };
};

module.exports = loggerMiddleware;
